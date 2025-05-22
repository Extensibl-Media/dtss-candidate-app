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
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
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
		XCircle
	} from 'lucide-svelte';
	import type { PageData } from './$types';
	import { format, parseISO, isValid, addDays } from 'date-fns';
	import { cn } from '$lib/utils';
	import {
		AlertDialog,
		AlertDialogTrigger,
		AlertDialogContent,
		AlertDialogHeader,
		AlertDialogTitle,
		AlertDialogDescription,
		AlertDialogFooter
	} from '$lib/components/ui/alert-dialog';
	// import { onMount } from 'svelte';

	export let data: PageData;

	let cancelDialogOpen = false;

	$: timesheet = data.timesheet;
	$: requisition = data.requisition;
	$: company = data.company;
	$: recurrenceDay = data.recurrenceDay;

	// Format dates for display
	$: weekBeginDate = parseISO(timesheet.weekBeginDate);
	$: weekEndDate = addDays(weekBeginDate, 6);
	$: formattedWeekRange = isValid(weekBeginDate)
		? `${format(weekBeginDate, 'MMM d')} - ${format(weekEndDate, 'MMM d, yyyy')}`
		: 'Invalid date range';

	// Function to correctly format a full date with timezone handling
	function formatFullDate(dateString) {
		if (!dateString) return 'N/A';

		try {
			// Parse the input date string correctly
			const date =
				typeof dateString === 'string'
					? parseISO(dateString) // Use parseISO for ISO strings
					: new Date(dateString); // Fallback for other formats

			// Ensure the date is valid
			if (!isValid(date)) {
				console.error('Invalid date:', dateString);
				return 'Invalid Date';
			}

			// Format with browser's locale settings
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

	// Debug helper to troubleshoot date issues
	// function debugDate(dateStr) {
	// 	try {
	// 		console.log('Debug date:', {
	// 			input: dateStr,
	// 			parsed: parseISO(dateStr),
	// 			asDate: new Date(dateStr),
	// 			formatted: format(parseISO(dateStr), 'yyyy-MM-dd')
	// 		});
	// 	} catch (error) {
	// 		console.error('Debug date error:', error);
	// 	}
	// }

	// // Add this in your onMount or component initialization
	// onMount(() => {
	// 	// Debug the timesheet dates
	// 	if (timesheet) {
	// 		debugDate(timesheet.weekBeginDate);
	// 		console.log('Timesheet raw data:', timesheet);

	// 		if (timesheet.hoursRaw && timesheet.hoursRaw.length > 0) {
	// 			timesheet.hoursRaw.forEach((entry) => {
	// 				debugDate(entry.date);
	// 			});
	// 		}
	// 	}
	// });

	// Get status badge for timesheet
	function getTimesheetStatusBadge(timesheet) {
		if (!timesheet) return { text: 'Loading...', icon: Clock };

		if (timesheet.status === 'APPROVED' && !timesheet.awaitingClientSignature) {
			return { text: 'APPROVED', icon: CheckCircle2 };
		} else if (timesheet.status === 'PENDING') {
			return { text: 'PENDING', icon: AlertCircle };
		} else if (timesheet.status === 'DISCREPANCY') {
			return { text: 'DISCREPANCY', icon: AlertTriangle };
		} else if (timesheet.status === 'VOID') {
			return { text: 'VOID', icon: X };
		} else if (timesheet.status === 'REJECTED') {
			return { text: 'REJECTED', icon: X };
		}
	}

	// Format time (8:00 AM - 4:00 PM)
	function formatTimeRange(startTime, endTime) {
		if (!startTime || !endTime) return 'N/A';

		const formatTime = (time) => {
			const [hours, minutes] = time.split(':');
			const hour = parseInt(hours);
			const ampm = hour >= 12 ? 'PM' : 'AM';
			const hour12 = hour % 12 || 12;
			return `${hour12}:${minutes || '00'} ${ampm}`;
		};

		// Handle cases where time might include timezone info
		const cleanStartTime = startTime.split('-')[0];
		const cleanEndTime = endTime.split('-')[0];

		return `${formatTime(cleanStartTime)} - ${formatTime(cleanEndTime)}`;
	}

	// Calculate net hours (considering lunch break)
	function calculateNetHours(startTime, endTime, lunchStartTime, lunchEndTime) {
		if (!startTime || !endTime || !lunchStartTime || !lunchEndTime) return 'N/A';

		const parseTimeToMinutes = (timeStr) => {
			const [hours, minutes] = timeStr.split(':').map(Number);
			return hours * 60 + minutes;
		};

		// Clean up time strings to remove timezone info if present
		const cleanStartTime = startTime.split('-')[0];
		const cleanEndTime = endTime.split('-')[0];
		const cleanLunchStartTime = lunchStartTime.split('-')[0];
		const cleanLunchEndTime = lunchEndTime.split('-')[0];

		const dayStart = parseTimeToMinutes(cleanStartTime);
		const dayEnd = parseTimeToMinutes(cleanEndTime);
		const lunchStart = parseTimeToMinutes(cleanLunchStartTime);
		const lunchEnd = parseTimeToMinutes(cleanLunchEndTime);

		const totalWorkMinutes = dayEnd - dayStart - (lunchEnd - lunchStart);
		return (totalWorkMinutes / 60).toFixed(2);
	}

	$: statusBadge = getTimesheetStatusBadge(timesheet);
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
	</div>

	<!-- Timesheet Header -->
	<div>
		<div class="flex flex-wrap items-center gap-3">
			<h1 class="text-2xl font-bold">Timesheet</h1>
			<Badge
				variant="default"
				class={cn(
					timesheet.status === 'PENDING' && 'bg-yellow-300 hover:bg-yellow-400',
					timesheet.status === 'DISCREPANCY' && 'bg-orange-400 hover:bg-bg-orange-500',
					timesheet.status === 'APPROVED' && 'bg-green-400 hover:bg-green-600',
					timesheet.status === 'VOID' && 'bg-gray-200 hover:bg-gray-300',
					timesheet.status === 'REJECTED' && 'bg-red-500 hover:bg-red-500',
					'gap-1'
				)}
			>
				{timesheet.status}
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
							<p class="text-muted-foreground">
								Base Rate: ${timesheet?.candidateRateBase || 0}/hr
							</p>
							<p class="text-muted-foreground">
								Overtime Rate: ${timesheet?.candidateRateOT || 0}/hr
							</p>
						</div>
					</div>

					<Separator />

					<!-- Total Hours Summary -->
					<div>
						<h3 class="font-medium mb-3">Hours Summary</h3>
						<div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
							<div class="p-3 bg-gray-50 rounded-lg">
								<p class="text-sm text-gray-600">Total Hours</p>
								<p class="text-xl font-bold">{timesheet?.totalHoursWorked || 0}</p>
							</div>
							<div class="p-3 bg-gray-50 rounded-lg">
								<p class="text-sm text-gray-600">Regular Hours</p>
								<p class="text-xl font-bold">{timesheet?.totalHoursWorked || 0}</p>
							</div>
							<div class="p-3 bg-gray-50 rounded-lg">
								<p class="text-sm text-gray-600">Overtime</p>
								<p class="text-xl font-bold">0</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Tabs for different sections -->
			<Tabs class="w-full">
				<TabsList class="grid grid-cols-2 w-full max-w-md">
					<TabsTrigger value="hours">Daily Hours</TabsTrigger>
					<TabsTrigger value="details">Shift Details</TabsTrigger>
				</TabsList>

				<TabsContent value="hours" class="space-y-4 pt-4">
					<Card>
						<CardHeader>
							<CardTitle>Hours Worked</CardTitle>
							<CardDescription>Breakdown of hours for the week</CardDescription>
						</CardHeader>

						<CardContent>
							{#if timesheet?.hoursRaw && timesheet.hoursRaw.length > 0}
								<div class="divide-y">
									{#each timesheet.hoursRaw as entry}
										<div class="py-3 flex items-center justify-between">
											<div>
												<p class="font-medium">{formatFullDate(entry.date)}</p>
												<p class="text-sm text-muted-foreground">
													{formatTimeRange(entry.startTime, entry.endTime)}
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
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="details" class="space-y-4 pt-4">
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
											Work Hours: {format(recurrenceDay.dayStartTime, 'hh:mm a')} - {format(
												recurrenceDay.dayEndTime,
												'hh:mm a'
											)}
										</p>
										<p class="text-muted-foreground">
											Lunch Break: {format(recurrenceDay.lunchStartTime, 'hh:mm a')} - {format(
												recurrenceDay.lunchEndTime,
												'hh:mm a'
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
				</TabsContent>
			</Tabs>
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
						{#if timesheet?.status === 'PENDING'}
							This timesheet is pending approval.
						{:else if timesheet?.status === 'DISCREPANCY'}
							This timesheet has discrepancies that need to be resolved.
						{:else if timesheet?.status === 'VOID'}
							This timesheet has been voided.
						{:else if timesheet?.status === 'REJECTED'}
							This timesheet has been rejected.
						{:else if timesheet?.status === 'APPROVED'}
							This timesheet has been approved and processed.
						{:else}
							You need to validate this timesheet.
						{/if}
					</p>

					<div class="space-y-2">
						{#if !timesheet?.validated}
							<Button
								disabled={timesheet.status === 'APPROVED' ||
									timesheet.status === 'PENDING' ||
									timesheet.status === 'VOID'}
								class="w-full gap-2 bg-blue-700 hover:bg-blue-800"
							>
								<CheckCircle2 class="h-4 w-4" />
								<span>Validate Timesheet</span>
							</Button>
						{/if}

						<AlertDialog open={cancelDialogOpen}>
							<AlertDialogTrigger asChild>
								<Button
									on:click={() => (cancelDialogOpen = true)}
									disabled={timesheet.status === 'APPROVED'}
									variant="destructive"
									class="w-full gap-2"
								>
									<XCircle class="h-4 w-4" />
									<span>Cancel Timesheet</span>
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This timesheet will be marked as rejected.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<Button variant="outline" on:click={() => (cancelDialogOpen = false)}
										>Cancel</Button
									>
									<Button variant="destructive" class="ml-2">Reject</Button>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
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
