<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { faker } from '@faker-js/faker';
	import { cn } from '$lib/utils';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { PlusIcon } from 'lucide-svelte';
	import { format, parse } from 'date-fns';
	import { formatInTimeZone } from 'date-fns-tz';
	import { getUserTimezone } from '$lib/_helpers/UTCTimezoneUtils.js';
	export let data;
	$: timesheets = data.timesheets;

	const statusColor = (status: string) => {
		switch (status) {
			case 'DUE':
				return 'bg-red-400 text-red-50 hover:bg-red-400';
		}
	};

	$: console.log('timesheets', timesheets);
</script>

<svelte:head>
	<title>Timesheets | DentalStaff.US</title>
</svelte:head>

<section class="container flex flex-col gap-6 pb-16 max-w-4xl px-4">
	<div class="flex items-center justify-between flex-wrap gap-8">
		<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">Timesheets</h1>
		<!-- <Button
			href="/timesheets/new"
			class="bg-blue-800 hover:bg-blue-900 w-full md:w-fit flex-grow md:grow-0"
			><PlusIcon size={24} class="mr-2" />New Timesheet</Button
		> -->
	</div>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Company/Shift Details</Table.Head>
				<Table.Head>Work Week</Table.Head>
				<Table.Head>Status</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each timesheets as data, i (i)}
				<Table.Row class="cursor-pointer" on:click={() => goto(`/timesheets/${data.timesheet.id}`)}>
					<Table.Cell class="font-medium">
						<div class="flex flex-row gap-2 items-center">
							<img alt="company logo" class="md:w-12 h-8 w-8 md:h-12" src={data.company.logo} />
							<div>
								<p class="">{data.requisition.disciplineName}</p>
								<p class="text-xs text-gray-700">{data.company.name}</p>
							</div>
						</div>
					</Table.Cell>
					<Table.Cell>{formatInTimeZone(data.timesheet.weekBeginDate, getUserTimezone(), 'PP')}</Table.Cell>
					<Table.Cell>
						<Badge
							class={cn(
								data?.timesheet?.status === 'PENDING' && 'bg-yellow-300 hover:bg-yellow-400',
								data?.timesheet?.status === 'DISCREPANCY' && 'bg-orange-400 hover:bg-orange-500',
								data?.timesheet?.status === 'APPROVED' && 'bg-green-400 hover:bg-green-600',
								data?.timesheet?.status === 'VOID' && 'bg-gray-200 hover:bg-gray-300',
								data?.timesheet?.status === 'REJECTED' && 'bg-red-500 hover:bg-red-600'
							)}
							variant="default">{data.timesheet.status}</Badge
						>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</section>
