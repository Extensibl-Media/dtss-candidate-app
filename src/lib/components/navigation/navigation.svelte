<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import {
		UserRound,
		LogOut,
		Menu,
		PieChart,
		CalendarSearch,
		Briefcase,
		CalendarClock,
		MessageCircle
	} from 'lucide-svelte';
	import { APP_NAME } from '$lib/config/constants';
	import Logo from '$lib/components/logo/logo.svelte';
	import { goto } from '$app/navigation';
	import convertNameToInitials from '$lib/_helpers/convertNameToInitials';
	import {
		Drawer,
		CloseButton,
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper
	} from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import { page } from '$app/stores';

	export let user: any;
	let hidden = true;
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};
	$: activeUrl = $page.url.pathname;

	function signOut() {
		// Create a form element
		var form = document.createElement('form');
		form.method = 'POST';
		form.action = '/auth/sign-out';
		document.body.appendChild(form);
		form.submit();
	}

	let initials: string = '';
	$: {
		if (user) {
			initials = convertNameToInitials(user.firstName, user.lastName);
		}
	}
</script>

<header class="sticky top-0 z-40 w-full border-b bg-blue-900">
	<div class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
		<div class="flex gap-6 md:gap-10">
			<a class="flex items-center space-x-2" href="/"
				><Logo /><span class="inline-block font-bold text-white">{APP_NAME}</span></a
			>
			<nav class="md:flex gap-6 hidden">
			{#if user}
			<a
				class="flex items-center text-sm font-medium text-white"
				href="/temporary"
				class:active={'/temporary' === activeUrl}>Temporary</a
			>
			<a
				class="flex items-center text-sm font-medium text-white"
				href="/permanent"
				class:active={'/permanent' === activeUrl}>Permanent</a
			>
			<a
				class="flex items-center text-sm font-medium text-white"
				href="/timesheets"
				class:active={activeUrl.includes('/timesheets')}>Timesheets</a
			>
			<a
				class="flex items-center text-sm font-medium text-white"
				href="/inbox"
				class:active={activeUrl.includes('/inbox')}>Inbox</a
			>
			{:else}
			<a
				class="flex items-center text-sm font-medium text-white"
				href="/candidates"
				class:active={'/candidates' === activeUrl}>For Candidates</a
			>
			<a
				class="flex items-center text-sm font-medium text-white"
				href="/staffing-solutions"
				class:active={'/staffing-solutions' === activeUrl}>For Dentists</a
			>
			<a
				class="flex items-center text-sm font-medium text-white"
				href="/contact-us"
				class:active={activeUrl.includes('/contact-us')}>Contact Us</a
			>
			<a
				class="flex items-center text-sm font-medium text-white"
				href="/about-us"
				class:active={activeUrl.includes('/about-us')}>About Us</a
			>
			{/if}
			</nav>
		</div>
		<div class="flex flex-1 items-center justify-end space-x-4">
			<nav class="md:flex items-center space-x-1 hidden">
				{#if !user}
					<Button on:click={() => goto('/auth/sign-in')}>Sign in</Button>
				{:else}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
								<Avatar.Root class="h-8 w-8">
									<Avatar.Fallback>{initials}</Avatar.Fallback>
								</Avatar.Root>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-56" align="end">
							<DropdownMenu.Label class="font-normal">
								<div class="flex flex-col space-y-1">
									<p class="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
									<p class="text-xs leading-none text-muted-foreground">{user?.email}</p>
								</div>
							</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Group>
								<DropdownMenu.Item on:click={() => goto('/profile')}>
									<UserRound class="mr-2 h-4 w-4" />
									Profile
									<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
								</DropdownMenu.Item>
							</DropdownMenu.Group>
							<DropdownMenu.Separator />
							<DropdownMenu.Item on:click={signOut}>
								<LogOut class="mr-2 h-4 w-4" />
								Sign out
								<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{/if}
			</nav>
			<nav class="md:hidden flex items-center space-x-1">
				<Button
					variant="ghost"
					class="hover:bg-blue-800"
					size="icon"
					on:click={() => (hidden = false)}
				>
					<Menu class="h-[1.2rem] w-[1.2rem]" color="white" />
				</Button>
				<Drawer
					class="bg-blue-900 -left-2"
					transitionType="fly"
					{transitionParams}
					bind:hidden
					id="sidebar"
				>
					<div class="flex items-center">
						<CloseButton
							on:click={() => (hidden = true)}
							class="mb-4 text-white hover:bg-blue-800"
						/>
					</div>
					<Sidebar
						{activeUrl}
						activeClass="flex items-center p-2 text-base font-normal text-white bg-blue-800 rounded-lg hover:bg-blue-800"
						nonActiveClass="flex items-center p-2 text-base font-normal text-white bg-blue-900 rounded-lg hover:bg-blue-800"
					>
						<SidebarWrapper class="bg-blue-900">
							<SidebarGroup>
								<SidebarItem on:click={() => (hidden = true)} label="Temporary" href="/temporary">
									<svelte:fragment slot="icon">
										<CalendarSearch
											class="w-6 h-6 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
										/>
									</svelte:fragment>
								</SidebarItem>
								<SidebarItem on:click={() => (hidden = true)} label="Permanent" href="/permanent">
									<svelte:fragment slot="icon">
										<Briefcase
											class="w-6 h-6 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
										/>
									</svelte:fragment>
								</SidebarItem>
								<SidebarItem on:click={() => (hidden = true)} label="Timesheets" href="/timesheets">
									<svelte:fragment slot="icon">
										<CalendarClock
											class="w-6 h-6 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
										/>
									</svelte:fragment>
								</SidebarItem>
								<SidebarItem on:click={() => (hidden = true)} label="Inbox" href="/inbox">
									<svelte:fragment slot="icon">
										<MessageCircle
											class="w-6 h-6 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
										/>
									</svelte:fragment>
								</SidebarItem>
							</SidebarGroup>
						</SidebarWrapper>
					</Sidebar>
				</Drawer>
			</nav>
		</div>
	</div>
</header>

<style>
	.active {
		@apply text-yellow-300;
	}
</style>
