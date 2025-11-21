<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		CalendarDays,
		Clock,
		Building,
		DollarSign,
		ArrowLeft,
		CheckCircle2,
		X,
		AlertCircle,
		Calendar,
		Info,
		Download,
		Printer,
		Clipboard,
		AlertTriangle,
		XCircle,
		Edit,
		Save
	} from 'lucide-svelte';
	import type { PageData } from './$types';
	import {
		format,
		parseISO,
		isValid,
		addDays,
		eachDayOfInterval,
		startOfWeek,
		endOfWeek
	} from 'date-fns';
	import { cn } from '$lib/utils';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	export let data: PageData;

	let cancelDialogOpen = false;
	let verifyDialogOpen = false;
	let submitDialogOpen = false;
	let isEditing = false;
	let initialLoadDone = false;

	$: timesheet = data.timesheet;
	$: requisition = data.requisition;
	$: company = data.company;
	$: recurrenceDay = data.recurrenceDay;
	$: workday = data.workday;

	// ✅ Initialize time entries from existing timesheet or create empty ones
	let timeEntries: Record<string, { startTime: string; endTime: string; hours: number }> = {};

	// ✅ Calculate week dates
	$: weekBeginDate = parseISO(timesheet.weekBeginDate);
	$: weekEndDate = endOfWeek(weekBeginDate);
	$: weekDays = eachDayOfInterval({ start: weekBeginDate, end: weekEndDate });
	$: formattedWeekRange = isValid(weekBeginDate)
		? `${format(weekBeginDate, 'MMM d')} - ${format(weekEndDate, 'MMM d, yyyy')}`
		: 'Invalid date range';

	$: workdayDates = data.workdays
		? data.workdays.map((wd: any) => wd.recurrenceDay.date)
		: [recurrenceDay?.date].filter(Boolean);

	$: scheduledWorkDays = workdayDates
		.map((dateStr: string) => {
			const date = parseISO(dateStr);
			return {
				date,
				dateKey: format(date, 'yyyy-MM-dd'),
				dayString: format(date, 'EEE, MMM d')
			};
		})
		.sort((a, b) => a.date.getTime() - b.date.getTime());

	// ✅ Initialize entries for all scheduled workdays
	$: {
		if (scheduledWorkDays.length > 0 && !initialLoadDone) {
			scheduledWorkDays.forEach(({ dateKey }) => {
				if (!timeEntries[dateKey]) {
					timeEntries[dateKey] = { startTime: '', endTime: '', hours: 0 };
				}
			});
		}
	}

	// ✅ Function to load time entries
	function loadTimeEntries() {
		// First, initialize all scheduled days with empty values
		scheduledWorkDays.forEach(({ dateKey }) => {
			timeEntries[dateKey] = { startTime: '', endTime: '', hours: 0 };
		});

		// Then, load existing data
		if (timesheet?.hoursRaw && Array.isArray(timesheet.hoursRaw) && timesheet.hoursRaw.length > 0) {
			timesheet.hoursRaw.forEach((entry: any) => {
				const dateKey = entry.date;

				const startTime = entry.startTime
					? new Date(entry.startTime).toLocaleTimeString('en-US', {
							hour12: false,
							hour: '2-digit',
							minute: '2-digit'
						})
					: '';

				const endTime = entry.endTime
					? new Date(entry.endTime).toLocaleTimeString('en-US', {
							hour12: false,
							hour: '2-digit',
							minute: '2-digit'
						})
					: '';

				if (timeEntries[dateKey]) {
					timeEntries[dateKey] = {
						startTime,
						endTime,
						hours: entry.hours || 0
					};
				}
			});
		}

		timeEntries = { ...timeEntries };
	}

	// ✅ Only load once on mount
	onMount(() => {
		loadTimeEntries();
		initialLoadDone = true;
	});

	// ✅ Calculate total hours
	$: totalHours = Object.values(timeEntries).reduce((sum, entry) => sum + (entry.hours || 0), 0);

	// ✅ Check if form is valid
	$: hasHoursEntered = Object.values(timeEntries).some((entry) => entry.hours > 0);
	$: isDraft = timesheet?.status === 'DRAFT';
	$: isPending = timesheet?.status === 'PENDING';
	$: isDiscrepancy = timesheet?.status === 'DISCREPANCY';
	$: isApproved = timesheet?.status === 'APPROVED';
	$: isVoid = timesheet?.status === 'VOID';
	$: isRejected = timesheet?.status === 'REJECTED';

	// ✅ Can edit if DRAFT or DISCREPANCY (when editing mode is on)
	$: canEdit = isDraft || (isDiscrepancy && isEditing);
	$: showEditButton = isDiscrepancy && !isEditing;

	function calculateHours(startTime: string, endTime: string): number {
		if (!startTime || !endTime) return 0;
		const [startHour, startMin] = startTime.split(':').map(Number);
		const [endHour, endMin] = endTime.split(':').map(Number);
		const hours = endHour - startHour + (endMin - startMin) / 60;
		return Math.round(hours * 100) / 100;
	}

	function updateTimeEntry(dateKey: string, field: 'startTime' | 'endTime', value: string) {
		if (!timeEntries[dateKey]) {
			timeEntries[dateKey] = { startTime: '', endTime: '', hours: 0 };
		}

		timeEntries[dateKey][field] = value;
		timeEntries[dateKey].hours = calculateHours(
			timeEntries[dateKey].startTime,
			timeEntries[dateKey].endTime
		);

		// Force reactivity
		timeEntries = { ...timeEntries };
	}

	function enableEditing() {
		isEditing = true;
	}

	function cancelEditing() {
		isEditing = false;
		loadTimeEntries();
	}

	function safeFormatDate(date: any, formatStr: string = 'hh:mm a'): string {
		if (!date) return 'N/A';

		try {
			const parsedDate = typeof date === 'string' ? new Date(date) : date;
			if (!isValid(parsedDate)) {
				return 'N/A';
			}
			return format(parsedDate, formatStr);
		} catch (error) {
			console.error('Error formatting date:', error, date);
			return 'N/A';
		}
	}

	function formatFullDate(dateString: string) {
		if (!dateString) return 'N/A';

		try {
			const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);

			if (!isValid(date)) {
				console.error('Invalid date:', dateString);
				return 'Invalid Date';
			}

			return date.toLocaleDateString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch (error) {
			console.error('Error formatting date:', error, dateString);
			return 'Date Error';
		}
	}

	function getTimesheetStatusBadge(status: string) {
		const badges: Record<string, { text: string; icon: any; class: string }> = {
			DRAFT: { text: 'DRAFT', icon: Edit, class: 'bg-gray-300 hover:bg-gray-400' },
			PENDING: { text: 'PENDING', icon: AlertCircle, class: 'bg-yellow-300 hover:bg-yellow-400' },
			DISCREPANCY: {
				text: 'DISCREPANCY',
				icon: AlertTriangle,
				class: 'bg-orange-400 hover:bg-orange-500'
			},
			APPROVED: { text: 'APPROVED', icon: CheckCircle2, class: 'bg-green-400 hover:bg-green-600' },
			VOID: { text: 'VOID', icon: X, class: 'bg-gray-200 hover:bg-gray-300' },
			REJECTED: { text: 'REJECTED', icon: XCircle, class: 'bg-red-500 hover:bg-red-600' }
		};

		return badges[status] || badges.DRAFT;
	}

	$: statusBadge = getTimesheetStatusBadge(timesheet?.status || 'DRAFT');

	// ✅ Debug logging
	$: {
		console.log('Time entries:', timeEntries);
		console.log('Total hours:', totalHours);
		console.log('Has hours entered:', hasHoursEntered);
		console.log('recurrence day',recurrenceDay)
	}
</script>

<svelte:head>
	<title>Timesheet Details | DentalStaff.US</title>
</svelte:head>

<section class="container mx-auto px-4 py-6 space-y-6">
	<!-- Back button and actions -->
	<div class="flex flex-wrap items-center justify-between gap-4">
		<Button variant="ghost" class="w-fit gap-2" href="/timesheets">
			<ArrowLeft class="h-4 w-4" />
			<span>Back to Timesheets</span>
		</Button>

		{#if !isDraft}
			<div class="flex gap-2">
				<Button variant="outline" size="sm" class="gap-1">
					<Printer class="w-4 h-4" />
					<span class="hidden sm:inline">Print</span>
				</Button>
				<Button variant="outline" size="sm" class="gap-1">
					<Download class="w-4 h-4" />
					<span class="hidden sm:inline">Download</span>
				</Button>
			</div>
		{/if}
	</div>

	<!-- Timesheet Header -->
	<div>
		<div class="flex flex-wrap items-center gap-3">
			<h1 class="text-2xl font-bold">Timesheet</h1>
			<Badge variant="default" class={cn(statusBadge.class, 'gap-1')}>
				<svelte:component this={statusBadge.icon} class="h-3 w-3" />
				{statusBadge.text}
			</Badge>
		</div>
		<p class="text-muted-foreground flex items-center mt-1">
			<Calendar class="h-4 w-4 mr-1" />
			Week of {formattedWeekRange}
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<!-- Main Content -->
		<div class="md:col-span-2 space-y-6">
			<!-- Company and Position Info -->
			<Card>
				<CardHeader>
					<CardTitle>{requisition?.title || 'Work Assignment'}</CardTitle>
					<CardDescription>{company?.name || 'Company'}</CardDescription>
				</CardHeader>
				<CardContent class="space-y-6">
					<!-- Payment Information -->
					<div class="flex items-start gap-4">
						<div class="bg-blue-100 rounded-full p-2.5">
							<DollarSign class="h-5 w-5 text-blue-700" />
						</div>
						<div>
							<h3 class="font-medium">Pay Information</h3>
							<p class="text-muted-foreground">Base Rate: ${requisition?.hourlyRate || 0}/hr</p>
						</div>
					</div>

					<Separator />

					<!-- Total Hours Summary -->
					<div>
						<h3 class="font-medium mb-3">Hours Summary</h3>
						<div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
							<div class="p-3 bg-gray-50 rounded-lg">
								<p class="text-sm text-gray-600">Total Hours</p>
								<p class="text-xl font-bold">{totalHours.toFixed(2)}</p>
							</div>
							<div class="p-3 bg-gray-50 rounded-lg">
								<p class="text-sm text-gray-600">Regular Hours</p>
								<p class="text-xl font-bold">{Math.min(totalHours, 40).toFixed(2)}</p>
							</div>
							<div class="p-3 bg-gray-50 rounded-lg">
								<p class="text-sm text-gray-600">Overtime</p>
								<p class="text-xl font-bold">{Math.max(0, totalHours - 40).toFixed(2)}</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Hours Entry/Display -->
			<Card>
				<CardHeader>
					<div class="flex items-center justify-between">
						<div>
							<CardTitle>Daily Hours</CardTitle>
							<CardDescription>
								{canEdit ? 'Enter your hours for scheduled workdays' : 'Hours worked'}
							</CardDescription>
						</div>
						<div class="flex gap-2">
							{#if canEdit}
								<Badge variant="secondary" class="gap-1">
									<Edit class="h-3 w-3" />
									Editable
								</Badge>
							{/if}
							{#if showEditButton}
								<Button size="sm" variant="outline" on:click={enableEditing}>
									<Edit class="h-4 w-4 mr-2" />
									Edit Hours
								</Button>
							{/if}
						</div>
					</div>
				</CardHeader>

				<CardContent>
					{#if canEdit}
						<!-- ✅ EDIT MODE: Editable time entries -->
						{#if scheduledWorkDays.length > 0}
							<div class="space-y-4">
								<div
									class="grid grid-cols-4 gap-2 items-center px-2 text-xs font-medium text-gray-500"
								>
									<span>Date</span>
									<span>Start Time</span>
									<span>End Time</span>
									<span class="text-right">Hours</span>
								</div>

								{#each scheduledWorkDays as { dateKey, dayString }}
									{#if timeEntries[dateKey]}
										<div class="grid grid-cols-4 gap-2 items-center p-3 bg-gray-50 rounded-lg">
											<div class="text-sm font-medium">
												{dayString}
											</div>
											<Input
												type="time"
												class="text-sm"
												value={timeEntries[dateKey].startTime}
												on:input={(e) => updateTimeEntry(dateKey, 'startTime', e.currentTarget.value)}
											/>
											<Input
												type="time"
												class="text-sm"
												value={timeEntries[dateKey].endTime}
												on:input={(e) => updateTimeEntry(dateKey, 'endTime', e.currentTarget.value)}
											/>
											<div class="text-right text-sm font-semibold">
												{timeEntries[dateKey]?.hours?.toFixed(2) || '0.00'} hrs
											</div>
										</div>
									{/if}
								{/each}

								{#if isDiscrepancy && isEditing}
									<div class="flex justify-end pt-2">
										<Button variant="outline" size="sm" on:click={cancelEditing}>
											Cancel Editing
										</Button>
									</div>
								{/if}
							</div>
						{:else}
							<div class="py-12 text-center text-muted-foreground">
								<AlertCircle class="h-12 w-12 mx-auto mb-3" />
								<p>No scheduled workdays found for this week</p>
							</div>
						{/if}
					{:else}
						<!-- ✅ VIEW MODE: Display submitted hours -->
						{#if timesheet?.hoursRaw && timesheet.hoursRaw.length > 0}
							<div class="divide-y">
								{#each timesheet.hoursRaw as entry}
									<div class="py-3 flex items-center justify-between">
										<div>
											<p class="font-medium">{formatFullDate(entry.date)}</p>
											<p class="text-sm text-muted-foreground">
												{safeFormatDate(entry.startTime)} - {safeFormatDate(entry.endTime)}
											</p>
										</div>
										<div class="text-right">
											<p class="text-lg font-semibold">{entry.hours} hrs</p>
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<div class="py-12 text-center text-muted-foreground">
								<Clipboard class="h-12 w-12 mx-auto mb-3" />
								<p>No hours recorded for this timesheet</p>
							</div>
						{/if}
					{/if}
				</CardContent>
			</Card>

			<!-- Shift Details -->
			<Card>
				<CardHeader>
					<CardTitle>Shift Information</CardTitle>
					<CardDescription>Details about the work assignment</CardDescription>
				</CardHeader>

				<CardContent class="space-y-4">
					<!-- Date and Time -->
					<div class="flex items-start gap-4">
						<div class="bg-blue-100 rounded-full p-2.5">
							<CalendarDays class="h-5 w-5 text-blue-700" />
						</div>
						<div>
							<h3 class="font-medium">Date & Schedule</h3>
							{#if recurrenceDay}
								<p class="text-muted-foreground">{formatFullDate(recurrenceDay.date)}</p>
								<p class="text-muted-foreground">
									Work Hours: {safeFormatDate(recurrenceDay.dayStartTime)} - {safeFormatDate(
										recurrenceDay.dayEndTime
									)}
								</p>
								<p class="text-muted-foreground">
									Lunch Break: {safeFormatDate(recurrenceDay.lunchStartTime)} - {safeFormatDate(
										recurrenceDay.lunchEndTime
									)}
								</p>
							{:else}
								<p class="text-muted-foreground">Schedule information not available</p>
							{/if}
						</div>
					</div>

					<!-- Job Description -->
					{#if requisition?.jobDescription}
						<div class="flex items-start gap-4">
							<div class="bg-blue-100 rounded-full p-2.5">
								<Info class="h-5 w-5 text-blue-700" />
							</div>
							<div>
								<h3 class="font-medium">Job Description</h3>
								<p class="text-muted-foreground whitespace-pre-wrap">
									{requisition.jobDescription}
								</p>
							</div>
						</div>
					{/if}

					<!-- Special Instructions -->
					{#if requisition?.specialInstructions}
						<Alert>
							<Info class="h-4 w-4" />
							<AlertTitle>Special Instructions</AlertTitle>
							<AlertDescription class="whitespace-pre-wrap">
								{requisition.specialInstructions}
							</AlertDescription>
						</Alert>
					{/if}
				</CardContent>
			</Card>
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Company Information -->
			<Card>
				<CardHeader>
					<CardTitle>Company</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="flex items-center gap-3">
						{#if company?.logo}
							<img
								src={company.logo}
								alt={company.name}
								class="w-12 h-12 rounded-full object-cover"
							/>
						{:else}
							<div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
								<Building class="w-6 h-6 text-gray-500" />
							</div>
						{/if}
						<div>
							<h3 class="font-semibold">{company?.name || 'Company Name'}</h3>
							{#if requisition?.id}
								<p class="text-sm text-muted-foreground">Requisition #{requisition.id}</p>
							{/if}
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Timesheet Actions -->
			<Card>
				<CardHeader>
					<CardTitle>Actions</CardTitle>
				</CardHeader>
				<CardContent class="space-y-4">
					<p class="text-sm text-muted-foreground">
						{#if isDraft}
							Fill in your hours and submit your timesheet for approval.
						{:else if isPending}
							This timesheet is pending approval.
						{:else if isDiscrepancy}
							This timesheet has discrepancies. Please review and correct your hours, then
							resubmit.
						{:else if isVoid}
							This timesheet has been voided.
						{:else if isRejected}
							This timesheet has been rejected.
						{:else if isApproved}
							This timesheet has been approved and processed.
						{/if}
					</p>

					<div class="space-y-2">
						<!-- ✅ SUBMIT BUTTON (for DRAFT) -->
						{#if isDraft}
							<AlertDialog.Root bind:open={submitDialogOpen}>
								<AlertDialog.Trigger asChild>
									<Button
										on:click={() => (submitDialogOpen = true)}
										disabled={!hasHoursEntered || totalHours === 0}
										class="w-full gap-2 bg-blue-700 hover:bg-blue-800"
									>
										<Save class="h-4 w-4" />
										<span>Submit Timesheet</span>
									</Button>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Submit Timesheet</AlertDialog.Title>
										<AlertDialog.Description>
											You're submitting {totalHours.toFixed(2)} hours for the week of {formattedWeekRange}.
											This will send your timesheet for approval.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<Button variant="outline" on:click={() => (submitDialogOpen = false)}>
											Cancel
										</Button>
										<form action="?/submitTimesheet" method="POST" use:enhance>
											<input type="hidden" name="entries" value={JSON.stringify(timeEntries)} />
											<input type="hidden" name="totalHours" value={totalHours} />
											<Button
												type="submit"
												on:click={() => (submitDialogOpen = false)}
												class="ml-2 bg-blue-700 hover:bg-blue-800"
											>
												Submit
											</Button>
										</form>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						{/if}

						<!-- ✅ RESUBMIT BUTTON (for DISCREPANCY after editing) -->
						{#if isDiscrepancy}
							<AlertDialog.Root bind:open={verifyDialogOpen}>
								<AlertDialog.Trigger asChild>
									<Button
										on:click={() => (verifyDialogOpen = true)}
										disabled={!isEditing || !hasHoursEntered || totalHours === 0}
										class="w-full gap-2 bg-green-600 hover:bg-green-700"
									>
										<CheckCircle2 class="h-4 w-4" />
										<span>Resubmit for Validation</span>
									</Button>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Resubmit Timesheet</AlertDialog.Title>
										<AlertDialog.Description>
											You're resubmitting {totalHours.toFixed(2)} hours for the week of {formattedWeekRange}.
											This will send your corrected timesheet for validation.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<Button variant="outline" on:click={() => (verifyDialogOpen = false)}>
											Cancel
										</Button>
										<form action="?/resubmitTimesheet" method="POST" use:enhance>
											<input type="hidden" name="entries" value={JSON.stringify(timeEntries)} />
											<input type="hidden" name="totalHours" value={totalHours} />
											<Button
												type="submit"
												on:click={() => {
													verifyDialogOpen = false;
													isEditing = false;
												}}
												class="ml-2 bg-green-600 hover:bg-green-700"
											>
												Resubmit
											</Button>
										</form>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						{/if}

						<!-- ✅ CANCEL BUTTON (for DRAFT or PENDING) -->
						{#if isDraft || isPending}
							<AlertDialog.Root bind:open={cancelDialogOpen}>
								<AlertDialog.Trigger asChild>
									<Button
										on:click={() => (cancelDialogOpen = true)}
										variant="outline"
										class="w-full border-red-200 text-red-700 hover:bg-red-50 gap-2"
									>
										<XCircle class="h-4 w-4" />
										<span>Cancel Timesheet</span>
									</Button>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Are you sure?</AlertDialog.Title>
										<AlertDialog.Description>
											This action cannot be undone. This timesheet will be voided permanently.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<Button variant="outline" on:click={() => (cancelDialogOpen = false)}>
											Cancel
										</Button>
										<form action="?/cancelTimesheet" method="POST" use:enhance>
											<Button
												type="submit"
												on:click={() => (cancelDialogOpen = false)}
												variant="destructive"
												class="ml-2"
											>
												Void Timesheet
											</Button>
										</form>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						{/if}
					</div>
				</CardContent>
			</Card>

			<!-- Support Information -->
			<Card>
				<CardHeader>
					<CardTitle>Need Help?</CardTitle>
				</CardHeader>
				<CardContent>
					<p class="text-sm text-muted-foreground mb-4">
						If you have questions about this timesheet, please contact support.
					</p>

					<Button variant="outline" class="w-full">Contact Support</Button>
				</CardContent>
			</Card>
		</div>
	</div>
</section>
