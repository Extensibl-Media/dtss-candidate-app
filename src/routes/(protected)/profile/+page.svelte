<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import { userSchema } from '$lib/config/zod-schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import {
		ChevronRight,
		File,
		FileCheck,
		Loader2,
		Mail,
		MapPin,
		Phone,
		Shield,
		SquareAsterisk,
		UserCog
	} from 'lucide-svelte';
	import { AlertCircle } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import * as Avatar from '$lib/components/ui/avatar';
	import { faker } from '@faker-js/faker';
	// export let data: any;
</script>

<section class="container max-w-5xl divide-y divide-y-gray-500">
	<div class="mb-4 flex gap-4 items-end">
		<Avatar.Root class="h-16 w-16 md:h-20 md:w-20">
			<Avatar.Image src={faker.image.avatar()} />
		</Avatar.Root>
		<div>
			<p class="text-2xl md:text-4xl font-bold">Candidate Name</p>
			<p>candidate@email.com</p>
		</div>
	</div>
	<div class="py-2">
		<div class="flex justify-between items-center my-6 md:my-8">
			<div class="flex gap-2 items-center">
				<UserCog />
				<p>Edit Profile</p>
			</div>
			<ChevronRight />
		</div>
		<div class="flex justify-between items-center my-6 md:my-8">
			<div class="flex gap-2 items-center">
				<FileCheck />
				<p>Resume</p>
			</div>
			<ChevronRight />
		</div>
	</div>
	<div class="py-2">
		<div class="flex justify-between items-center my-6 md:my-8">
			<div class="flex gap-2 items-center">
				<MapPin />
				<p>Location</p>
			</div>
			<ChevronRight />
		</div>
		<div class="flex justify-between items-center my-6 md:my-8">
			<div class="flex gap-2 items-center">
				<File />
				<p>Documents</p>
			</div>
			<ChevronRight />
		</div>
		<div class="flex justify-between items-center my-6 md:my-8">
			<div class="flex gap-2 items-center">
				<SquareAsterisk />
				<p>Password</p>
			</div>
			<ChevronRight />
		</div>
	</div>
</section>
