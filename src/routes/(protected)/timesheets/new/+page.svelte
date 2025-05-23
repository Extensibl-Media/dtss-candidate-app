<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { Building, Building2, ChevronLeft, ChevronRight } from 'lucide-svelte';
	// import type { WorkdaysResponse, Company, Workday } from './types';
	import { onMount } from 'svelte';
	import {
		format,
		addWeeks,
		subWeeks,
		startOfWeek,
		endOfWeek,
		eachDayOfInterval,
		getDay,
		parse
	} from 'date-fns';
	import type { PageData } from './$types';
	import type { Selected } from 'bits-ui';
	import { superForm } from 'sveltekit-superforms/client';
	import { invalidateAll } from '$app/navigation';
	import { getConsistentWeekBeginDate } from '$lib/_helpers/dates';

	type CompanySelect = {
		id: string;
		name: string;
		logoUrl: string;
	};

	export let data: PageData;
	let currentWeek = new Date();
	let weekDays: Date[] = [];
	let timeEntries: Record<
		string,
		{ startTime: string; endTime: string; hours: number; workdayId: string }
	> = {};
	let selectedCompany: CompanySelect | undefined = undefined;

	$: ({ companies, workdays, timesheets } = data);
	$: totalHours = Object.values(timeEntries).reduce((sum, entry) => sum + (entry.hours || 0), 0);
	$: weekOfDate = getConsistentWeekBeginDate(currentWeek.toISOString().split('T')[0]);

	$: weekLabel = `Week of ${format(startOfWeek(currentWeek), 'MMM d, yyyy')}`;
	$: {
		const start = weekOfDate;
		const end = endOfWeek(currentWeek);
		weekDays = eachDayOfInterval({ start, end });
	}
	$: currentWeekWorkdays = getWorkdaysForWeek(currentWeek);
	$: hasWorkdaysThisWeek = currentWeekWorkdays.length > 0;
	$: existingTimesheet = hasExistingTimesheet(currentWeek);

	$: {
		const timesheetData = {
			company: selectedCompany,
			weekOf: weekOfDate,
			entries: Object.entries(timeEntries).map(([date, entry]) => ({
				date,
				...entry
			})),
			totalHours
		};

		// console.log('Timesheet Submission Data:', JSON.stringify(timesheetData, null, 2));
	}
	$: workdaysForCurrentWeek = getWorkdaysForCurrentWeek({ workdays, weekDays, selectedCompany });
	$: console.log({ workdaysForCurrentWeek });
	$: jsonTimeEntries = JSON.stringify(
		Object.entries(timeEntries).map(([date, entry]) => ({
			date,
			...entry
		}))
	);

	const submitForm = data.form;
	const {
		form: formData,
		errors,
		submitting,
		enhance
	} = superForm(submitForm, {
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				// Handle success
				await invalidateAll();
			}
		}
	});

	function findMatchingTimesheet(date: Date) {
		// Get week start as YYYY-MM-DD string
		const weekStartStr = format(startOfWeek(date), 'yyyy-MM-dd');

		// Debug logging
		// console.log('Looking for timesheet with weekBeginDate:', weekStartStr);
		// console.log(
		// 	'Available timesheets:',
		// 	timesheets.map((ts) => ({
		// 		id: ts.timesheet.id,
		// 		weekBeginDate: ts.timesheet.weekBeginDate,
		// 		// Direct string comparison without formatting
		// 		matches: ts.timesheet.weekBeginDate === weekStartStr
		// 	}))
		// );

		// Find timesheet with matching week start date (direct string comparison)
		const matchingTimesheet = timesheets.find((ts) => ts.timesheet.weekBeginDate === weekStartStr);

		// if (matchingTimesheet) {
		// 	console.log('Found matching timesheet:', matchingTimesheet.timesheet.id);
		// } else {
		// 	console.log('No matching timesheet found');
		// }

		return matchingTimesheet;
	}

	function calculateHours(startTime: string, endTime: string): number {
		if (!startTime || !endTime) return 0;
		const [startHour, startMin] = startTime.split(':').map(Number);
		const [endHour, endMin] = endTime.split(':').map(Number);
		const hours = endHour - startHour + (endMin - startMin) / 60;
		return Math.round(hours * 100) / 100;
	}

	function handleTimeChange(date: Date, type: 'startTime' | 'endTime', value: string) {
		const dateKey = format(date, 'yyyy-MM-dd');
		timeEntries[dateKey] = {
			...timeEntries[dateKey],
			[type]: value,
			workdayId: workdays.find((workday) => workday.date === dateKey)?.id,
			hours: calculateHours(
				type === 'startTime' ? value : timeEntries[dateKey]?.startTime || '',
				type === 'endTime' ? value : timeEntries[dateKey]?.endTime || ''
			)
		};
		timeEntries = timeEntries;
	}

	function hasExistingTimesheet(date: Date): boolean {
		// Get the consistent week start date in the format YYYY-MM-DD
		const weekStart = format(startOfWeek(date), 'yyyy-MM-dd');

		// Debug logging
		// console.log('Checking for timesheets with weekBeginDate:', weekStart);
		// console.log(
		// 	'Available timesheets weekBeginDates:',
		// 	timesheets.map((ts) => ({
		// 		id: ts.timesheet.id,
		// 		weekBeginDate: ts.timesheet.weekBeginDate
		// 	}))
		// );

		// Compare using the same string format
		return timesheets.some((ts) => {
			// Direct string comparison - the database already has YYYY-MM-DD
			const matches = ts.timesheet.weekBeginDate === weekStart;

			if (matches) {
				console.log(`Found matching timesheet: ${ts.timesheet.id} for week ${weekStart}`);
			}

			return matches;
		});
	}

	function getWorkdaysForWeek(date: Date): typeof workdays {
		const weekStart = startOfWeek(date);
		const weekEnd = endOfWeek(date);
		return workdays.filter((workday) => {
			const workdayDate = new Date(workday.date);
			return workdayDate >= weekStart && workdayDate <= weekEnd;
		});
	}

	function nextWeek() {
		const nextDate = addWeeks(currentWeek, 1);
		if (nextDate <= new Date()) {
			currentWeek = nextDate;
		}
	}

	function prevWeek() {
		const prevDate = subWeeks(currentWeek, 1);
		// if (!hasExistingTimesheet(prevDate)) {
		currentWeek = prevDate;
		// }
	}

	const handleUpdateCompany = (el: Selected<unknown> | undefined) => {
		const company = companies.find((c) => c.id === String(el?.value));
		selectedCompany = company;
	};

	function getWorkdaysForCurrentWeek(data) {
		const { workdays, weekDays, selectedCompany } = data;
		if (!selectedCompany || !workdays?.length) return [];

		// Format weekDays to YYYY-MM-DD format for comparison
		const formattedWeekDays = weekDays.map((weekDay) => {
			const date = new Date(weekDay);
			return format(date, 'yyyy-MM-dd');
		});

		// Filter workdays that match the current week days and selected company
		return workdays
			.filter((workday) => {
				const matchesWeekDay = formattedWeekDays.includes(workday.date);
				const matchesCompany = workday.companyId === selectedCompany?.id;

				return matchesWeekDay && matchesCompany;
			})
			.sort((a, b) => {
				const dateA = new Date(a.date);
				const dateB = new Date(b.date);
				return dateA.getTime() - dateB.getTime();
			});
	}
</script>

<svelte:head>
	<title>New Timesheet | DentalStaff.US</title>
</svelte:head>

<section class="container flex flex-col gap-6 pb-16 max-w-4xl px-4">
	<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">New Timesheet</h1>

	<!-- Company Selection -->
	<div class="space-y-4">
		<Select.Root onSelectedChange={handleUpdateCompany}>
			<Select.Trigger class="w-full">
				<Select.Value placeholder="Select a company" />
			</Select.Trigger>
			<Select.Content>
				{#each companies as company}
					<Select.Item value={company.id.toString()}>
						<div class="flex items-center gap-2">
							<img src={company.logoUrl} alt={company.name} class="w-6 h-6 rounded-full" />
							<span>{company.name}</span>
						</div>
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>

		{#if selectedCompany}
			<div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
				<img
					src={selectedCompany.logoUrl}
					alt={selectedCompany.name}
					class="w-12 h-12 rounded-full"
				/>
				<div>
					<h3 class="font-semibold">{selectedCompany.name}</h3>
				</div>
			</div>

			<!-- Week Navigation and Content - Only show if company is selected -->
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<Button variant="ghost" on:click={prevWeek}>
						<ChevronLeft class="w-5 h-5" />
					</Button>
					<h2 class="text-xl font-semibold">{weekLabel}</h2>
					<Button variant="ghost" on:click={nextWeek}>
						<ChevronRight class="w-5 h-5" />
					</Button>
				</div>
				{#if existingTimesheet}
					{@const timesheet = findMatchingTimesheet(currentWeek)}
					<div class="p-4 bg-blue-50 text-blue-800 rounded-lg flex justify-between items-center">
						<span>A timesheet has already been submitted for this week.</span>
						<a
							href={`/timesheets/${timesheet?.timesheet?.id}`}
							class="text-blue-600 hover:text-blue-800 underline"
						>
							View Timesheet
						</a>
					</div>
				{:else if !hasWorkdaysThisWeek}
					<div class="p-4 bg-gray-50 text-gray-600 rounded-lg">
						No scheduled workdays for this week.
					</div>
				{:else}
					<form class="space-y-4" method="post" action="?/submitTimesheet" use:enhance>
						<input type="hidden" name="companyId" bind:value={selectedCompany.id} />
						<input type="hidden" name="weekStartDate" bind:value={weekOfDate} />
						<input type="hidden" name="totalHours" bind:value={totalHours} />
						<input type="hidden" name="entries" bind:value={jsonTimeEntries} />
						<!-- Time Entries -->
						<div class="space-y-4">
							<div class="grid grid-cols-4 gap-2 items-center px-4">
								<span class="text-xs">Date</span>
								<span class="text-xs opacity-0 md:opacity-100">Start Time</span>
								<span class="text-xs opacity-0 md:opacity-100">End Time</span>
								<span class="text-xs text-right">Total Hrs.</span>
							</div>
							{#each workdaysForCurrentWeek as day}
								{@const dateKey = day.date}
								{@const dayString = format(new Date(day.date + 'T12:00:00Z'), 'EEE, MMM d')}
								<div class="grid grid-cols-4 gap-2 items-center p-4 bg-white rounded-lg shadow-sm">
									<div class="text-xs md:text-sm flex flex-col">
										<span>{dayString.split(',')[0] + ','}</span>
										<span>{dayString.split(',')[1]}</span>
									</div>
									<div class="flex flex-col md:flex-row gap-2 col-span-2">
										<div class="flex gap-2 items-center justify-between flex-grow">
											<span class="inline md:hidden text-xs">Start</span>
											<input
												type="time"
												class="max-w-[120px] md:max-w-none border rounded px-2 py-1 flex-grow"
												value={timeEntries[dateKey]?.startTime || ''}
												on:input={(e) =>
													handleTimeChange(
														new Date(day.date + 'T12:00:00Z'),
														'startTime',
														e.currentTarget.value
													)}
											/>
										</div>
										<div class="flex gap-2 items-center justify-between flex-grow">
											<span class="inline md:hidden text-xs">End</span>

											<input
												type="time"
												class="max-w-[120px] md:max-w-none border rounded px-2 py-1 flex-grow"
												value={timeEntries[dateKey]?.endTime || ''}
												on:input={(e) =>
													handleTimeChange(
														new Date(day.date + 'T12:00:00Z'),
														'endTime',
														e.currentTarget.value
													)}
											/>
										</div>
									</div>
									<div class="text-right text-xs md:text-sm">
										{timeEntries[dateKey]?.hours || 0} hours
									</div>
								</div>
							{/each}
						</div>

						<!-- Total Hours -->
						<div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
							<span class="font-semibold">Total Hours</span>
							<span class="font-bold text-xl">{totalHours} hours</span>
						</div>

						<!-- Submit Button -->
						<Button
							class="w-full bg-blue-800 hover:bg-blue-900 text-white py-2"
							disabled={totalHours === 0 || $submitting}
							type="submit"
						>
							{#if $submitting}
								Submitting...
							{:else}
								Submit Timesheet
							{/if}
						</Button>
					</form>
				{/if}
			</div>
		{:else}
			<div
				class="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50"
			>
				<Building2 class="h-12 w-12 mx-auto text-gray-400" />
				<h3 class="mt-2 text-sm font-semibold text-gray-900">No company selected</h3>
				<p class="mt-1 text-sm text-gray-500">
					Please select a company from the dropdown above to begin creating your timesheet.
				</p>
			</div>
		{/if}
	</div>
</section>
