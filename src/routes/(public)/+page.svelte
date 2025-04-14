<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { APP_NAME } from '$lib/config/constants';
	import heroImg from "$lib/assets/hero-img.jpg"
</script>

<svelte:head>
	<title>Dental Staffing Solutions Made Simple | {APP_NAME}</title>
	<meta
		name="description"
		content="Sveltekit Auth Starter - An open source auth starter project utilizing lucia-auth, skeleton ui, prisma and sveltekit."
	/>
</svelte:head>

<div class="flex-1">
	<section class="container grid items-center py-12 md:py-40 gap-6 grid-cols-2">
		<div class="flex max-w-[980px] flex-col items-start gap-4 col-span-2 md:col-span-1">
			<h1 class="text-5xl md:text-7xl font-extrabold leading-tight tracking-tighter ">
			 Lorem ipsum dolor sit amet, consectetur adipiscing elit
			</h1>
			<p class="max-w-[700px] text-lg text-muted-foreground">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
			</p>
    		<div class="flex gap-4">
    			<Button class="bg-blue-800 hover:bg-blue-900" on:click={() => goto('/auth/sign-up')}>Get Started Today</Button>
    			<Button class="" on:click={() => goto('/auth/sign-up')} variant="outline">See Features</Button>
    		</div>
		</div>
		<div class="col-span-2 md:col-span-1 relative flex items-center justify-center">
		  <img alt="" src={heroImg} class="md:max-w-xl w-full"/>
		</div>
	</section>
</div>
