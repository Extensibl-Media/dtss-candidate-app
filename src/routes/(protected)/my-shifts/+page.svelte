<script lang="ts">
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "$lib/components/ui/select";
  import { Separator } from "$lib/components/ui/separator";
  import { Alert, AlertDescription, AlertTitle } from "$lib/components/ui/alert";
  import { Calendar } from "$lib/components/ui/calendar";
  import { CalendarDays, Clock, MapPin, Building, FileText, Calendar as CalendarIcon, ChevronRight, Calendar as CalendarCheck, AlertCircle, CheckCircle2, X, Info, Clipboard, DollarSign } from "lucide-svelte";
	import type { PageData } from "./$types";
	import { format, isAfter, isBefore, isSameDay, isToday, isWithinInterval, parseISO, startOfDay } from "date-fns";


  export let data: PageData;
  // Filters and sorting
  let timeFilter = "upcoming";
  let monthFilter: string = "";
  let monthsToGoBack = 12

  let monthOptions = Array.from({length: monthsToGoBack}, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {label: `${format(date, 'MMM')} ${format(date, 'yyyy')}` ,start: new Date(date.getFullYear(), date.getMonth(), 1), end: new Date(date.getFullYear(), date.getMonth() + 1, 0)};
  })

  const sortWorkdays =(upcoming: boolean = false) => (a, b) => {
    return upcoming ? a.recurrenceDay.date.localeCompare(b.recurrenceDay.date) : b.recurrenceDay.date.localeCompare(a.recurrenceDay.date);
  };

  console.log({monthOptions})

  $: workdays = data.workdays;

  $: todayStr = new Date().toISOString().split('T')[0];

  $: upcomingWorkdays = workdays
    .filter(workday => workday.recurrenceDay.date >= todayStr)
    .sort((a, b) => sortWorkdays(true)(a, b));

  $: pastWorkdays = monthFilter
    ? workdays
        .filter(workday => workday.recurrenceDay.date < todayStr)
        .filter(workday => {
          const month = monthOptions.find(month => month.label === monthFilter);
          if(month){
            // For this part, we still need parseISO since isWithinInterval requires Date objects
            return isWithinInterval(parseISO(workday.recurrenceDay.date), {
              start: month.start,
              end: month.end
            });
          }
          return false;
        })
        .sort((a, b) => sortWorkdays(false)(a, b))
    : workdays
        .filter(workday => workday.recurrenceDay.date < todayStr)
        .sort((a, b) => sortWorkdays(false)(a, b));

  $: console.log({pastWorkdays, upcomingWorkdays})

  function formatDayAndDate(dateString) {
    // Add a time in the middle of the day in UTC, then format with UTC timezone
    // This ensures consistent date display regardless of local timezone
    const date = new Date(dateString + "T12:00:00Z");
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC' // Force UTC timezone interpretation
    });
  }

  function formatTimeRange(startTime, endTime) {
    const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    // Extract just the time portion without timezone info
    const cleanStartTime = startTime.split('-')[0];
    const cleanEndTime = endTime.split('-')[0];

    return `${formatTime(cleanStartTime)} - ${formatTime(cleanEndTime)}`;
  }

  // Get status badge variant
  function getStatusBadge(status) {
    switch (status) {
      case 'FILLED':
        return { variant: "success", text: "Filled", icon: CheckCircle2, class: "text-white bg-green-500" };
      default:
        return { variant: "default", text: status, icon: Info, class: "" };
    }
  }

  function canCancelShift(dateString) {
    // Get today's date as a string in YYYY-MM-DD format
    const todayStr = new Date().toISOString().split('T')[0];

    // Simple string comparison - if the date is today, don't allow cancellation
    return dateString !== todayStr;
  }

  $: console.log({monthOptions, monthFilter})
</script>

<svelte:head>
  <title>My Shifts | DentalStaff.US</title>
</svelte:head>

<section class="container mx-auto px-4 space-y-8">
  <div class="flex flex-col gap-2">
    <h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
      My Shifts
    </h1>
    <p class="text-muted-foreground">
      View and manage your temporary assignments
    </p>
  </div>

  <Tabs value="upcoming" onValueChange={value => timeFilter = value}>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <TabsList>
        <TabsTrigger value="upcoming" class="px-4">Upcoming Shifts</TabsTrigger>
        <TabsTrigger value="past" class="px-4">Past Shifts</TabsTrigger>
      </TabsList>

      <div class="flex items-center gap-3">
        {#if timeFilter === 'past'}
          <Select onSelectedChange={option => monthFilter = option?.value || ''}>
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Filter by month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Months</SelectItem>
              {#each monthOptions as month}
                <SelectItem value={month.label}>{month.label}</SelectItem>
              {/each}
            </SelectContent>
          </Select>

          <Select onSelectedChange={option => sortOrder = option?.value || 'newest'}>
            <SelectTrigger class="w-[150px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        {/if}
      </div>
    </div>

    <!-- Upcoming Shifts Tab -->
    <TabsContent value="upcoming" class="mt-0">
      {#if upcomingWorkdays.length === 0}
        <Card>
          <CardContent class="pt-6 flex flex-col items-center text-center">
            <CalendarCheck class="h-12 w-12 text-muted-foreground mb-3" />
            <h3 class="text-lg font-medium">No Upcoming Shifts</h3>
            <p class="text-muted-foreground mt-1 mb-4">You don't have any upcoming shifts scheduled.</p>
            <Button>Browse Available Shifts</Button>
          </CardContent>
        </Card>
      {:else}
        <div class="space-y-4">
          {#each upcomingWorkdays as shift}
            {@const statusBadge = getStatusBadge(shift.recurrenceDay.status)}
            <Card>
              <CardContent class="p-0">
                <!-- Date Header -->
                <div class="bg-muted px-6 py-3 rounded-t-lg">
                  <div class="flex justify-between items-center">
                    <div class="font-medium">{formatDayAndDate(shift.recurrenceDay.date)}</div>
                    <Badge variant={statusBadge.variant} class={statusBadge.class}>
                      <svelte:component this={statusBadge.icon} class="h-3 w-3 mr-1" />
                      {statusBadge.text}
                    </Badge>
                  </div>
                </div>

                <!-- Shift Details -->
                <div class="p-6">
                  <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 class="text-xl font-semibold">{shift.requisition.title}</h3>
                      <p class="text-muted-foreground">{shift.requisition.companyName}</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                        <DollarSign class="h-4 w-4" />
                        <span>${shift.requisition.hourlyRate}/hr</span>
                      </div>
                      <Button href={`/my-shifts/${shift.workday.id}`} variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div class="flex items-start gap-3">
                      <Clock class="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p class="font-medium">Time</p>
                        <p class="text-muted-foreground">{formatTimeRange(shift.recurrenceDay.dayStartTime, shift.recurrenceDay.dayEndTime)}</p>
                      </div>
                    </div>

                    <div class="flex items-start gap-3">
                      <MapPin class="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p class="font-medium">Location</p>
                        <p class="text-muted-foreground">{shift.location.address1} {shift.location.address2 || ""} {shift.location.city}, {shift.location.state} {shift.location.zip}</p>
                      </div>
                    </div>
                  </div>

                  {#if shift.requisition.specialInstructions}
                    <Alert variant="default" class="mt-4">
                      <AlertCircle class="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>{shift.requisition.specialInstructions}</AlertDescription>
                    </Alert>
                  {/if}
                </div>

                <!-- Action Footer -->
                {#if canCancelShift(shift.recurrenceDay.date)}
                  <div class="px-6 py-4 bg-muted/50 border-t rounded-b-lg flex flex-wrap gap-3 justify-end">
                    <Button variant="outline" class="gap-2 border-red-200 text-red-700 hover:bg-red-50">
                      <X class="h-4 w-4" />
                      <span>Cancel Shift</span>
                    </Button>
                  </div>
                {/if}
              </CardContent>
            </Card>
          {/each}
        </div>
      {/if}
    </TabsContent>

    <!-- Past Shifts Tab -->
    <TabsContent value="past" class="mt-0">
      {#if pastWorkdays.length === 0}
        <Card>
          <CardContent class="pt-6 flex flex-col items-center text-center">
            <Clock class="h-12 w-12 text-muted-foreground mb-3" />
            <h3 class="text-lg font-medium">No Past Shifts Found</h3>
            <p class="text-muted-foreground mt-1">No shifts match your current filters.</p>
          </CardContent>
        </Card>
      {:else}
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 font-medium">Date</th>
                <th class="text-left py-3 px-4 font-medium">Position</th>
                <th class="text-left py-3 px-4 font-medium">Client</th>
                <th class="text-left py-3 px-4 font-medium">Hours</th>
                <th class="text-left py-3 px-4 font-medium">Status</th>
                <th class="text-left py-3 px-4 font-medium">Timesheet</th>
                <th class="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each pastWorkdays as shift}
                {@const statusBadge = getStatusBadge(shift.status)}

                <tr class="border-b hover:bg-gray-50">
                  <td class="py-4 px-4">
                    <div class="font-medium">{formatDayAndDate(shift.recurrenceDay.date)}</div>
                    <div class="text-xs text-muted-foreground">
                      {formatTimeRange(shift.recurrenceDay.dayStartTime, shift.recurrenceDay.dayEndTime)}
                    </div>
                  </td>

                  <td class="py-4 px-4">{shift.requisition.title}</td>

                  <td class="py-4 px-4">
                    <div>{shift.requisition.companyName}</div>
                    <div class="text-xs text-muted-foreground truncate max-w-[200px]">
                        {shift.location.address1} {shift.location.address2 || ""} {shift.location.city}, {shift.location.state} {shift.location.zip}
                    </div>
                  </td>

                  <td class="py-4 px-4">
                    <!-- {#if shift.timesheet}
                      <div class="font-medium">{shift.timesheet.hoursWorked} hrs</div>
                      <div class="text-xs text-muted-foreground">
                        ${shift.timesheet.earnings.toFixed(2)}
                      </div>
                    {:else}
                      <span class="text-muted-foreground">-</span>
                    {/if} -->
                  </td>

                  <td class="py-4 px-4">
                    <Badge variant={statusBadge.variant}>
                      <svelte:component this={statusBadge.icon} class="h-3 w-3 mr-1" />
                      {statusBadge.text}
                    </Badge>
                  </td>

                  <td class="py-4 px-4">
                    <!-- <Badge variant={timesheetBadge.variant}>
                      <svelte:component this={timesheetBadge.icon} class="h-3 w-3 mr-1" />
                      {timesheetBadge.text}
                    </Badge> -->
                  </td>

                  <td class="py-4 px-4 text-right">
                    <Button variant="outline" size="sm" href={`/my-shifts/${shift.workday.id}`}>
                      View Details
                    </Button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </TabsContent>
  </Tabs>
</section>
