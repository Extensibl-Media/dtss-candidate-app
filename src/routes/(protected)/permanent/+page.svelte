<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import { Briefcase, CircleDollarSign, Heart, MapPin } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	export let data;
	$: requisitions = data.requisitions;
	$: applied = data.applied;

	$: console.log({ requisitions, applied });
</script>

<svelte:head>
	<title>Permanent Jobs | DentalStaff.US</title>
</svelte:head>

<section class="container grid items-center gap-6 px-4">
	<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
		Permanent Positions
	</h1>
	<Tabs.Root value="Recommended">
		<Tabs.List class="gap-6">
			<Tabs.Trigger value="Recommended">Recommended</Tabs.Trigger>
			<Tabs.Trigger value="Applied">Applied</Tabs.Trigger>
			<!-- <Tabs.Trigger value="Saved">Saved</Tabs.Trigger> -->
		</Tabs.List>
		<Tabs.Content value="Recommended">
			<div class="grid grid-cols-6 gap-8 mt-8">
				<!-- Opening Card Item -->
				{#each requisitions as opening}
					<div class="col-span-6 md:col-span-3 lg:col-span-2">
						<div class="p-4 flex flex-col gap-6 border border-gray-300 rounded-md relative">
							<div class="flex flex-col gap-4 w-full">
								<div class="flex justify-between items-start">
									<img alt="" class="h-24 w-24 rounded-md" src={opening.company.companyLogo} />
									<!-- <div class="hover:bg-gray-100 rounded-sm flex items-center justify-center p-2">
										<Heart class="text-black" />
									</div> -->
								</div>
								<div>
									<p class="font-semibold text-2xl">{opening.title}</p>
									<p>{opening.company.companyName}</p>
								</div>
							</div>
							<div class="flex flex-col gap-2">
								<div class="flex items-center gap-1">
									<MapPin size={18} class="text-gray-500" />
									<p class="text-sm">{opening.location.city}, {opening.location.state}</p>
								</div>
								<div class="flex items-center gap-1">
									<CircleDollarSign size={18} class="text-gray-500" />
									<p class="text-sm">${opening.hourlyRate}/hr</p>
								</div>
								<div class="flex items-center gap-1">
									<Briefcase size={18} class="text-gray-500" />
									<p class="text-sm">
										{opening.permanentPosition ? 'Permanent' : 'Temporary'} Hire
									</p>
								</div>
							</div>
							<a class="w-full" href={`/permanent/${opening.id}`}
								><Button class="w-full bg-blue-900 text-white hover:bg-blue-800">
									View Opening
								</Button></a
							>
						</div>
					</div>
				{/each}
			</div>
		</Tabs.Content>
		<Tabs.Content value="Applied">
			<div class="grid grid-cols-6 gap-8 mt-8">
				<!-- Opening Card Item -->
				{#each applied as appliedOpening}
					<div class="col-span-6 md:col-span-3 lg:col-span-2">
						<div class="p-4 flex flex-col gap-6 border border-gray-300 rounded-md relative">
							<div class="flex flex-col gap-4 w-full">
								<div class="flex justify-between items-start">
									<img
										alt=""
										class="h-24 w-24 rounded-md"
										src={appliedOpening?.company.companyLogo}
									/>
									<!-- <div class="hover:bg-gray-100 rounded-sm flex items-center justify-center p-2">
										<Heart class="text-black" />
									</div> -->
								</div>
								<div>
									<p class="font-semibold text-2xl">{appliedOpening?.title}</p>
									<p>{appliedOpening?.company.companyName}</p>
								</div>
							</div>
							<div class="flex flex-col gap-2">
								<div class="flex items-center gap-1">
									<MapPin size={18} class="text-gray-500" />
									<p class="text-sm">
										{appliedOpening?.location.city}, {appliedOpening?.location.state}
									</p>
								</div>
								<div class="flex items-center gap-1">
									<CircleDollarSign size={18} class="text-gray-500" />
									<p class="text-sm">${appliedOpening?.hourlyRate}/hr</p>
								</div>
								<div class="flex items-center gap-1">
									<Briefcase size={18} class="text-gray-500" />
									<p class="text-sm">
										{appliedOpening?.permanentPosition ? 'Permanent' : 'Temporary'} Hire
									</p>
								</div>
							</div>
							<a class="w-full" href={`/permanent/${appliedOpening?.id}`}
								><Button class="w-full bg-blue-900 text-white hover:bg-blue-800">
									View Opening
								</Button></a
							>
						</div>
					</div>
				{/each}
			</div>
		</Tabs.Content>
		<Tabs.Content value="Saved">
			<div class="grid grid-cols-6 gap-8 mt-8">
				<!-- Opening Card Item -->
			</div>
		</Tabs.Content>
	</Tabs.Root>
</section>
