<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
</script>

<section class="container grid items-center gap-6">
	<div class="flex max-w-[980px] flex-col items-start gap-2">
		{#if $page.status === 404}
			<div
				class="w-full min-h-screen flex flex-col gap-4 items-center justify-center py-12 text-center"
			>
				<h1 class="text-6xl md:text-8xl">404</h1>
				<p class="text-lg md:text-xl">Page Not Found</p>
				<p class="text-muted-foreground text-sm">
					We apologize, the page you were looking for could not be found at this time.
				</p>
				<Button on:click={() => window.history.back()} class="bg-blue-800 hover:bg-blue-900"
					>Go Back</Button
				>
			</div>
		{:else}
			<div
				class="w-full min-h-screen flex flex-col gap-4 items-center justify-center py-12 text-center"
			>
				<h1 class="text-6xl md:text-8xl">{$page.status}</h1>
				<p class="text-lg md:text-xl">Internal Server Error</p>
				<p class="text-muted-foreground text-sm">
					We apologize for the inconvenience, and are investigating the issue.
				</p>
				<Button on:click={() => window.history.back()} class="bg-blue-800 hover:bg-blue-900"
					>Go Back</Button
				>
			</div>
		{/if}

		{#if $page.error?.errorId}
			<p class="max-w-[700px] text-lg text-muted-foreground">Error ID: {$page.error.errorId}</p>
		{/if}
	</div>
</section>
