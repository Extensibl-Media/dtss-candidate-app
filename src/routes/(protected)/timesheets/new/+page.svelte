<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	// import type { WorkdaysResponse, Company, Workday } from './types';
	import { onMount } from 'svelte';
	import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
	import type { PageData } from './$types';
	import type { Selected } from 'bits-ui';

	type CompanySelect = {
		id: string;
		name: string;
		logoUrl: string;
	};

	export let data: PageData;
	$: ({ companies, workdays, user, profile, timesheets } = data);
	let currentWeek = new Date();
	let weekDays: Date[] = [];
	let timeEntries: Record<string, { startTime: string; endTime: string; hours: number }> = {};
	let selectedCompany: CompanySelect | undefined = undefined;

	$: totalHours = Object.values(timeEntries).reduce((sum, entry) => sum + (entry.hours || 0), 0);

	$: weekLabel = `Week of ${format(startOfWeek(currentWeek), 'MMM d, yyyy')}`;

	$: {
		const start = startOfWeek(currentWeek);
		const end = endOfWeek(currentWeek);
		weekDays = eachDayOfInterval({ start, end });
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
			hours: calculateHours(
				type === 'startTime' ? value : timeEntries[dateKey]?.startTime || '',
				type === 'endTime' ? value : timeEntries[dateKey]?.endTime || ''
			)
		};
		timeEntries = timeEntries;
	}

	function hasExistingTimesheet(date: Date): boolean {
		const weekStart = format(startOfWeek(date), 'yyyy-MM-dd');
		return timesheets.some(
			(ts) => format(new Date(ts.timesheet.weekBeginDate), 'yyyy-MM-dd') === weekStart
		);
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
		if (nextDate <= new Date() && !hasExistingTimesheet(nextDate)) {
			currentWeek = nextDate;
		}
	}

	function prevWeek() {
		const prevDate = subWeeks(currentWeek, 1);
		if (!hasExistingTimesheet(prevDate)) {
			currentWeek = prevDate;
		}
	}

	$: currentWeekWorkdays = getWorkdaysForWeek(currentWeek);
	$: hasWorkdaysThisWeek = currentWeekWorkdays.length > 0;
	$: existingTimesheet = hasExistingTimesheet(currentWeek);
	$: isWeekValid = hasWorkdaysThisWeek && !existingTimesheet;

	async function handleSubmit() {
		if (!isWeekValid) {
			return;
		}
		const timesheetData = {
			company: selectedCompany,
			weekOf: format(startOfWeek(currentWeek), 'yyyy-MM-dd'),
			entries: Object.entries(timeEntries).map(([date, entry]) => ({
				date,
				...entry
			})),
			totalHours
		};

		console.log('Timesheet Submission Data:', JSON.stringify(timesheetData, null, 2));
		// TODO: Implement actual submission
	}

	const handleUpdateCompany = (el: Selected<unknown> | undefined) => {
		const company = companies.find((c) => c.id === String(el?.value));
		selectedCompany = company;
	};

	$: console.log({ companies, workdays, selectedCompany, timesheets });
	$: {
		const timesheetData = {
			company: selectedCompany,
			weekOf: format(startOfWeek(currentWeek), 'yyyy-MM-dd'),
			entries: Object.entries(timeEntries).map(([date, entry]) => ({
				date,
				...entry
			})),
			totalHours
		};

		console.log('Timesheet Submission Data:', JSON.stringify(timesheetData, null, 2));
	}
</script>

<section class="container max-w-4xl mx-auto py-8 space-y-8">
	<h1 class="text-3xl font-bold">New Timesheet</h1>

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
					{@const timesheet = timesheets.find(
						(ts) =>
							format(new Date(ts.timesheet.weekBeginDate), 'yyyy-MM-dd') ===
							format(startOfWeek(currentWeek), 'yyyy-MM-dd')
					)}
					<div class="p-4 bg-blue-50 text-blue-800 rounded-lg flex justify-between items-center">
						<span>A timesheet has already been submitted for this week.</span>
						<a
							href={`/timesheets/${timesheet?.timesheet.id}`}
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
					<!-- Time Entries -->
					<div class="space-y-4">
						<div class="grid grid-cols-4 gap-2 items-center px-4">
							<span class="text-xs">Date</span>
							<span class="text-xs opacity-0 md:opacity-100">Start Time</span>
							<span class="text-xs opacity-0 md:opacity-100">End Time</span>
							<span class="text-xs text-right">Total Hrs.</span>
						</div>
						{#each weekDays as day}
							{@const dateKey = format(day, 'yyyy-MM-dd')}
							{@const dayString = format(day, 'EEE, MMM d')}
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
											on:input={(e) => handleTimeChange(day, 'startTime', e.currentTarget.value)}
										/>
									</div>
									<div class="flex gap-2 items-center justify-between flex-grow">
										<span class="inline md:hidden text-xs">End</span>

										<input
											type="time"
											class="max-w-[120px] md:max-w-none border rounded px-2 py-1 flex-grow"
											value={timeEntries[dateKey]?.endTime || ''}
											on:input={(e) => handleTimeChange(day, 'endTime', e.currentTarget.value)}
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
						disabled={totalHours === 0}
						on:click={handleSubmit}
					>
						Submit Timesheet
					</Button>
				{/if}
			</div>
		{:else}
			<div
				class="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50"
			>
				<svg
					class="mx-auto h-12 w-12 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
					/>
				</svg>
				<h3 class="mt-2 text-sm font-semibold text-gray-900">No company selected</h3>
				<p class="mt-1 text-sm text-gray-500">
					Please select a company from the dropdown above to begin creating your timesheet.
				</p>
			</div>
		{/if}
	</div>
</section>
