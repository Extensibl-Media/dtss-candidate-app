<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { faker } from '@faker-js/faker';
	import { cn } from '$lib/utils';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { PlusIcon } from 'lucide-svelte';
	let timesheets = [
		{
			date: 'Aug. 2, 2024',
			status: 'DUE'
		},
		{
			date: 'Aug. 9, 2024',
			status: 'DUE'
		},
		{
			date: 'Aug. 16, 2024',
			status: 'DUE'
		},
		{
			date: 'Aug. 23, 2024',
			status: 'DUE'
		}
	];

	const statusColor = (status: string) => {
		switch (status) {
			case 'DUE':
				return 'bg-red-400 text-red-50 hover:bg-red-400';
		}
	};
</script>

<section class="container flex flex-col gap-6 pb-16 max-w-4xl">
	<div class="flex items-center justify-between flex-wrap gap-8">
		<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">Timesheets</h1>
		<Button
			href="/timesheets/new"
			class="bg-blue-800 hover:bg-blue-900 w-full md:w-fit flex-grow md:grow-0"
			><PlusIcon size={24} class="mr-2" />New Timesheet</Button
		>
	</div>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[70px]"></Table.Head>
				<Table.Head>Work Week</Table.Head>
				<Table.Head>Status</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each timesheets as timesheet, i (i)}
				<Table.Row class="cursor-pointer" on:click={() => goto('/timesheets/timesheet-id')}>
					<Table.Cell class="font-medium w-[70px]"
						><img alt="company logo" src={faker.image.avatar()} /></Table.Cell
					>
					<Table.Cell>{timesheet.date}</Table.Cell>
					<Table.Cell>
						<Badge class={cn(statusColor(timesheet.status))}>{timesheet.status}</Badge>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</section>
