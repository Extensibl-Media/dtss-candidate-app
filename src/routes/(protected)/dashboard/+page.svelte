<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Progress } from '$lib/components/ui/progress';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { Separator } from '$lib/components/ui/separator';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import {
		CalendarDays,
		Briefcase,
		Clock,
		Clipboard,
		MessageSquare,
		CheckCircle2,
		AlertCircle,
		ChevronRight,
		Users,
		CalendarClock,
		DollarSign,
		FileText,
		Calendar
	} from 'lucide-svelte';
	import type { PageData } from './$types';
	import { format } from 'date-fns';

	// Mock data - replace with your actual data
	export let data: PageData;
	$: user = data.user;
	$: workdays = data.workdays;
	$: timesheets = data.timesheets;

	// Helper function to format date
	// function formatDate(dateString) {
	// 	const date = new Date(dateString);
	// 	return new Intl.DateTimeFormat('en-US', {
	// 		month: 'short',
	// 		day: 'numeric'
	// 	}).format(date);
	// }

	// Get status badge variant
	function getStatusBadge(status) {
		switch (status.toLowerCase()) {
			case 'pending':
				return { variant: 'secondary', text: 'Pending' };
			case 'interview':
				return { variant: 'warning', text: 'Interview' };
			case 'offered':
				return { variant: 'success', text: 'Offered' };
			case 'rejected':
				return { variant: 'destructive', text: 'Rejected' };
			case 'confirmed':
				return { variant: 'success', text: 'Confirmed' };
			case 'pending submission':
				return { variant: 'warning', text: 'Submit Now' };
			case 'pending approval':
				return { variant: 'secondary', text: 'Awaiting Approval' };
			default:
				return { variant: 'secondary', text: status };
		}
	}
</script>

<svelte:head>
	<title>Dashboard | DentalStaff.US</title>
</svelte:head>

<section class="container mx-auto px-4 space-y-8">
	<div class="flex flex-col gap-2">
		<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">Dashboard</h1>
		<p class="text-muted-foreground">
			Welcome back, {user?.firstName}
		</p>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Left Column -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Tabs for Shifts and Timesheets -->
			<Tabs value="shifts" class="w-full">
				<TabsList class="grid w-full grid-cols-2 h-fit">
					<TabsTrigger value="shifts" class="flex items-center gap-2 col-span-2 sm:col-span-1">
						<CalendarClock class="h-4 w-4" />
						Upcoming Shifts
					</TabsTrigger>
					<TabsTrigger value="timesheets" class="flex items-center gap-2 col-span-2 sm:col-span-1">
						<Clipboard class="h-4 w-4" />
						Pending Timesheets
					</TabsTrigger>
				</TabsList>

				<!-- Shifts Tab -->
				<TabsContent value="shifts" class="pt-4">
					<Card>
						<CardContent class="p-0">
							{#if workdays.length === 0}
								<div class="text-center py-6">
									<p class="text-muted-foreground">No upcoming shifts</p>
								</div>
							{:else}
								<div class="divide-y">
									{#each workdays as shift}
										<div
											class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
										>
											<div class="space-y-1">
												<div class="font-medium">{shift.requisition.title}</div>
												<p class="text-sm text-muted-foreground">
													{shift.company} • {shift.location}
												</p>
												<div class="flex items-center gap-2 text-sm">
													<CalendarDays class="h-3.5 w-3.5 text-muted-foreground" />
													<span>{shift.date}</span>
													<Clock class="h-3.5 w-3.5 ml-2 text-muted-foreground" />
													<span>{shift.time}</span>
												</div>
											</div>
											<div class="flex items-center gap-2">
												<Badge variant="default">
													{shift.status}
												</Badge>
												<Button variant="outline" size="sm">Details</Button>
											</div>
										</div>
									{/each}
								</div>
							{/if}
						</CardContent>
						<CardFooter class="px-6 py-4 border-t">
							<Button href="/calendar" variant="ghost" size="sm" class="ml-auto gap-1">
								View Calendar <ChevronRight class="h-4 w-4" />
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				<!-- Timesheets Tab -->
				<TabsContent value="timesheets" class="pt-4">
					<Card>
						<CardContent class="p-0">
							{#if timesheets.length === 0}
								<div class="text-center py-6">
									<p class="text-muted-foreground">No pending timesheets</p>
								</div>
							{:else}
								<div class="divide-y">
									{#each timesheets as timesheet}
										<div
											class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
										>
											<div class="space-y-1">
												<div class="font-medium">{timesheet.requisition.title}</div>
												<p class="text-sm text-muted-foreground">{timesheet.company.name}</p>
												<div class="flex items-center gap-2 text-sm">
													<CalendarDays class="h-3.5 w-3.5 text-muted-foreground" />
													<span>{format(timesheet.timesheet.createdAt, 'PP')}</span>
													<Clock class="h-3.5 w-3.5 ml-2 text-muted-foreground" />
													<span>{timesheet.timesheet.totalHoursWorked} hours</span>
												</div>
											</div>
											<div class="flex items-center gap-2">
												<Badge variant="default">
													{getStatusBadge(timesheet.timesheet.status).text}
												</Badge>
												<Button
													href={`/timesheets/${timesheet.timesheet.id}`}
													variant="outline"
													size="sm"
												>
													View
												</Button>
											</div>
										</div>
									{/each}
								</div>
							{/if}
						</CardContent>
						<CardFooter class="px-6 py-4 border-t">
							<Button href="/timesheets" variant="ghost" size="sm" class="ml-auto gap-1">
								View All Timesheets <ChevronRight class="h-4 w-4" />
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
			<!-- Job Applications Section -->
			<!-- <Card>
				<CardHeader class="pb-3">
					<div class="flex items-center justify-between">
						<CardTitle>Recent Applications</CardTitle>
						<Button variant="ghost" size="sm" class="gap-1">
							View All <ChevronRight class="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{#if recentApplications.length === 0}
						<div class="text-center py-6">
							<p class="text-muted-foreground">No recent applications</p>
						</div>
					{:else}
						<div class="space-y-4">
							{#each recentApplications as application}
								<div
									class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b"
								>
									<div class="space-y-1">
										<div class="flex items-center gap-2">
											<span class="font-medium">{application.position}</span>
											<Badge
												variant={getJobTypeBadge(application.jobType).variant}
												class={getJobTypeBadge(application.jobType).class}
											>
												{application.jobType}
											</Badge>
										</div>
										<p class="text-sm text-muted-foreground">
											{application.company} • {application.location}
										</p>
										<p class="text-xs text-muted-foreground">
											Applied {formatDate(application.dateApplied)}
										</p>
									</div>
									<div class="flex items-center gap-2">
										<Badge variant={getStatusBadge(application.status).variant}>
											{getStatusBadge(application.status).text}
										</Badge>
										<Button variant="outline" size="sm">View</Button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</CardContent>
			</Card> -->

			<!-- Messages Section -->
			<!-- <Card>
				<CardHeader class="pb-3">
					<div class="flex items-center justify-between">
						<CardTitle>Recent Messages</CardTitle>
						<Button variant="ghost" size="sm" class="gap-1">
							View Inbox <ChevronRight class="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{#if unreadMessages.length === 0}
						<div class="text-center py-6">
							<p class="text-muted-foreground">No new messages</p>
						</div>
					{:else}
						<div class="space-y-4">
							{#each unreadMessages as message}
								<div class="flex items-start gap-4 pb-4 border-b">
									<div class="bg-blue-100 rounded-full p-2 mt-1">
										<MessageSquare class="h-4 w-4 text-blue-600" />
									</div>
									<div class="flex-1 space-y-1">
										<div class="flex items-center gap-2">
											<span class="font-medium">{message.from}</span>
											<Badge variant="secondary" class="text-xs font-normal">
												{message.company}
											</Badge>
											<span class="ml-auto text-xs text-muted-foreground">
												{formatDate(message.date)}
											</span>
										</div>
										<p class="font-medium text-sm">{message.subject}</p>
										<p class="text-sm text-muted-foreground line-clamp-1">
											{message.preview}
										</p>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</CardContent>
			</Card> -->
		</div>

		<!-- Right Column -->
		<div class="space-y-6">
			<!-- Profile Completion -->
			<!-- <Card>
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm font-medium">Your Profile</span>
                <span class="text-sm font-medium">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} class="h-2" />
            </div>

            <div class="space-y-4 pt-2">
              {#if !user?.completedOnboarding}
                <div class="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <h4 class="font-medium flex items-center gap-2 text-amber-800">
                    <AlertCircle class="h-4 w-4" />
                    Complete Your Profile
                  </h4>
                  <p class="text-sm text-amber-700 mt-1">
                    Improve your chances of getting hired by completing your profile.
                  </p>
                  <a href="/settings">
                      <Button size="sm" class="mt-3">Complete Now</Button>
                  </a>
                </div>
              {:else}
                <div class="bg-green-50 border border-green-200 rounded-md p-4">
                  <h4 class="font-medium flex items-center gap-2 text-green-800">
                    <CheckCircle2 class="h-4 w-4" />
                    Profile Complete
                  </h4>
                  <p class="text-sm text-green-700 mt-1">
                    Your profile is 100% complete and ready for employers.
                  </p>
                </div>
              {/if}

              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <CheckCircle2 class="h-4 w-4 text-green-500" />
                  <span class="text-sm">Personal Information</span>
                </div>
                <div class="flex items-center gap-2">
                  <CheckCircle2 class="h-4 w-4 text-green-500" />
                  <span class="text-sm">Contact Details</span>
                </div>
                <div class="flex items-center gap-2">
                  <CheckCircle2 class="h-4 w-4 text-green-500" />
                  <span class="text-sm">Professional Experience</span>
                </div>
                <div class="flex items-center gap-2">
                  {#if profileCompletion > 60}
                    <CheckCircle2 class="h-4 w-4 text-green-500" />
                  {:else}
                    <AlertCircle class="h-4 w-4 text-amber-500" />
                  {/if}
                  <span class="text-sm">Resume Upload</span>
                </div>
                <div class="flex items-center gap-2">
                  {#if profileCompletion > 80}
                    <CheckCircle2 class="h-4 w-4 text-green-500" />
                  {:else}
                    <AlertCircle class="h-4 w-4 text-amber-500" />
                  {/if}
                  <span class="text-sm">Required Documents</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> -->

			<!-- Quick Links -->
			<Card>
				<CardHeader>
					<CardTitle>Quick Links</CardTitle>
				</CardHeader>
				<CardContent class="p-0">
					<div class="grid grid-cols-1 divide-y">
						<a href="/permanent">
							<Button
								variant="ghost"
								class="flex justify-start items-center h-12 px-6 py-8 rounded-none w-full hover:bg-gray-50"
							>
								<Briefcase class="h-5 w-5 mr-3 text-blue-600" />
								<span>Browse Permanent Jobs</span>
							</Button>
						</a>
						<a href="/settings/resume">
							<Button
								variant="ghost"
								class="flex justify-start items-center h-12 px-6 py-8 rounded-none w-full hover:bg-gray-50"
							>
								<FileText class="h-5 w-5 mr-3 text-blue-600" />
								<span>Update Resume</span>
							</Button>
						</a>
						<a href="/calendar">
							<Button
								variant="ghost"
								class="flex justify-start items-center h-12 px-6 py-8 rounded-none w-full hover:bg-gray-50"
							>
								<Calendar class="h-5 w-5 mr-3 text-blue-600" />
								<span>View Shift Calendar</span>
							</Button>
						</a>
						<a href="/timesheets/new">
							<Button
								variant="ghost"
								class="flex justify-start items-center h-12 px-6 py-8 rounded-none w-full hover:bg-gray-50"
							>
								<Clipboard class="h-5 w-5 mr-3 text-blue-600" />
								<span>Submit Timesheet</span>
							</Button>
						</a>
					</div>
				</CardContent>
			</Card>

			<!-- Job Search Stats -->
			<!-- <Card>
				<CardHeader>
					<CardTitle>Job Stats</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-2">
						<div class="flex justify-between items-center">
							<span class="text-sm">Total Applications</span>
							<span class="font-medium">12</span>
						</div>
						<Separator />
						<div class="flex justify-between items-center">
              <span class="text-sm">Interviews</span>
              <span class="font-medium">4</span>
            </div>
            <Separator />
						<div class="flex justify-between items-center">
              <span class="text-sm">Job Offers</span>
              <span class="font-medium">2</span>
            </div>
            <Separator />
						<div class="flex justify-between items-center">
							<span class="text-sm">Completed Shifts</span>
							<span class="font-medium">8</span>
						</div>
					</div>
				</CardContent>
			</Card> -->
		</div>
	</div>
</section>
