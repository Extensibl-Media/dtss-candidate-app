<script lang="ts">
	import {
		ChevronRight,
		File,
		FileCheck,
		LogOut,
		SquareAsterisk,
		UserCog
	} from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import type { PageData } from './$types';
	import convertNameToInitials from '$lib/_helpers/convertNameToInitials';

	export let data: PageData;
	let initials: string = '';

	$: user = data.user
	$: {
		if (user) {
			initials = convertNameToInitials(user.firstName, user.lastName);
		}
	}

	function signOut() {
		// Create a form element
		var form = document.createElement('form');
		form.method = 'POST';
		form.action = '/auth/sign-out';
		document.body.appendChild(form);
		form.submit();
	}
</script>

<svelte:head>
  <title>My Settings | DentalStaff.US</title>
</svelte:head>

<section class="sm:container max-w-5xl mx-auto px-4">
	<div class="mb-4 flex gap-4 items-end">
		<Avatar.Root class="h-16 w-16 md:h-20 md:w-20">
			<Avatar.Image src={user?.avatarUrl} />
			<Avatar.Fallback>{initials}</Avatar.Fallback>
		</Avatar.Root>
		<div>
			<p class="text-2xl md:text-4xl font-bold">{user?.firstName} {user?.lastName}</p>
			<p>{user.email}</p>
		</div>
	</div>
	<div class="py-2">
		<a href="/settings/edit-profile" class="flex justify-between items-center my-6 md:my-8">
			<div class="flex gap-2 items-center">
				<UserCog />
				<p>Edit Profile</p>
			</div>
			<ChevronRight />
		</a>
		<a href="/settings/resume" class="flex justify-between items-center my-6 md:my-8">
			<div class="flex gap-2 items-center">
				<FileCheck />
				<p>Resume</p>
			</div>
			<ChevronRight />
		</a>


		<a href="/settings/documents" class="flex justify-between items-center my-6 md:my-8">
			<div class="flex gap-2 items-center">
				<File />
				<p>Documents</p>
			</div>
			<ChevronRight />
		</a>
		<a href="/auth/password/reset" class="flex justify-between items-center my-6 md:my-8">
			<div class="flex gap-2 items-center">
				<SquareAsterisk />
				<p>Password</p>
			</div>
			<ChevronRight />
		</a>
		<button on:click={signOut} class="w-full flex justify-between items-center my-6 md:my-8">
			<div class="flex gap-2 items-center">
				<LogOut />
				<p>Log Out</p>
			</div>
			<ChevronRight />
		</button>
	</div>
</section>
