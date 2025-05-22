<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import * as Alert from '$lib/components/ui/alert';
	import { AlertCircle, Loader } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { superForm } from 'sveltekit-superforms/client';
	import { STATES } from '$lib/config/constants';
	import { updateProfileSchema } from '$lib/config/zod-schemas';
	import type { PageData } from './$types';
	import AvatarUpload from '$lib/components/general/avatar-upload.svelte';
	import { tick } from 'svelte';
	import { getUserTimezone, formatTimezoneName } from '$lib/_helpers/UTCTimezoneUtils';

	export let data: PageData;
	$: user = data.user;
	$: formattedTimezone = formatTimezoneName(user.timezone);

	$: console.log('user timezone', {
		timezone: user.timezone,
		formatted: formattedTimezone
	});
	$: browserTimezone = getUserTimezone();

	const form = superForm(data.form);
	const avatarForm = superForm(data.avatarForm);
	const { enhance, form: formData, errors, submitting } = form;
	const { form: formAvatar, enhance: avatarEnhance, errors: avatarError } = avatarForm;

	$: selectedState = $formData.state
		? {
				label: $formData.state,
				value: $formData.state
			}
		: undefined;

	async function handleAvatarUpdated(url: string) {
		$formAvatar.url = url;

		// Wait for Svelte to update the DOM
		await tick();

		if ($formAvatar.url.length) {
			const form = document.getElementById('avatar-url-form') as HTMLFormElement;
			if (form) {
				// Ensure the hidden input has the value
				const input = form.querySelector('input[name="url"]') as HTMLInputElement;
				if (input) {
					input.value = url;
				}
				form.requestSubmit(); // Use the native submit instead of dispatchEvent
			}
		}
	}
</script>

<svelte:head>
	<title>Settings - Edit Profile | DentalStaff.US</title>
</svelte:head>

<section class="sm:container mx-auto px-4 py-6 space-y-8">
	<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">Edit Profile</h1>

	<!-- Avatar Upload Section -->
	<Card class="border-0 sm:border shadow-none sm:shadow-sm">
		<CardHeader class="p-0 pb-6 sm:p-6">
			<CardTitle>Profile Photo</CardTitle>
			<CardDescription>
				Update your profile picture. A clear headshot is recommended.
			</CardDescription>
		</CardHeader>
		<CardContent class="p-0 pt-0 sm:p-6 sm:pt-0">
			<AvatarUpload {user} onAvatarUpdated={handleAvatarUpdated} />
			<form
				id="avatar-url-form"
				class="hidden"
				method="post"
				action="?/avatarUpload"
				use:avatarEnhance
			>
				<input type="hidden" name="url" bind:value={$formAvatar.url} />
			</form>
			{#if $avatarError._errors?.length}
				<Alert.Root variant="destructive">
					<AlertCircle class="h-4 w-4" />
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>
						{$avatarError.url}
					</Alert.Description>
				</Alert.Root>
			{/if}
		</CardContent>
	</Card>

	<!-- Main Profile Form -->
	<Card class="border-0 sm:border shadow-none sm:shadow-sm">
		<CardHeader class="p-0 pb-6 sm:p-6">
			<CardTitle>Personal Information</CardTitle>
			<CardDescription>
				Update your personal details. This information will be visible to potential employers.
			</CardDescription>
		</CardHeader>
		<CardContent class="p-0 pt-0 sm:p-6 sm:pt-0">
			{#if $errors._errors?.length}
				<Alert.Root variant="destructive">
					<AlertCircle class="h-4 w-4" />
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>
						{#each $errors._errors as error}
							{error}
						{/each}
					</Alert.Description>
				</Alert.Root>
			{/if}
			<form method="post" action="?/submitProfile" class="space-y-6" use:enhance>
				<!-- Basic Info Section -->
				<div class="space-y-4">
					<h3 class="text-lg font-medium">Basic Information</h3>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="space-y-2">
							<Form.Field config={{ form: form, schema: updateProfileSchema }} name="firstName">
								<Form.Item>
									<Form.Label>First Name</Form.Label>
									<Form.Input />
									<Form.Validation />
								</Form.Item>
							</Form.Field>
						</div>

						<div class="space-y-2">
							<Form.Field config={{ form: form, schema: updateProfileSchema }} name="lastName">
								<Form.Item>
									<Form.Label>Last Name</Form.Label>
									<Form.Input />
									<Form.Validation />
								</Form.Item>
							</Form.Field>
						</div>
					</div>

					<div class="space-y-2">
						<Form.Field config={{ form: form, schema: updateProfileSchema }} name="email">
							<Form.Item>
								<Form.Label>Email</Form.Label>
								<Form.Input />
								<Form.Validation />
							</Form.Item>
						</Form.Field>
					</div>

					<div class="grid grid-cols-8 gap-4">
						<div class="space-y-2 col-span-8 sm:col-span-4">
							<Form.Field config={{ form: form, schema: updateProfileSchema }} name="cellPhone">
								<Form.Item>
									<Form.Label>Cell Phone #</Form.Label>
									<Form.Input
										type="tel"
										on:input={(event) => {
											// Get current value and strip non-digits
											const value = event.currentTarget.value.replace(/\D/g, '');

											// Limit to 10 digits and format
											const trimmed = value.substring(0, 10);
											let formatted = '';

											// Apply XXX-XXX-XXXX formatting
											if (trimmed.length <= 3) {
												formatted = trimmed;
											} else if (trimmed.length <= 6) {
												formatted = `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
											} else {
												formatted = `${trimmed.slice(0, 3)}-${trimmed.slice(3, 6)}-${trimmed.slice(
													6
												)}`;
											}

											// Update the input value
											event.currentTarget.value = formatted;

											// Update the form data
											$formData.cellPhone = formatted;
										}}
									/>
									<Form.Validation />
								</Form.Item>
							</Form.Field>
						</div>

						<div class="space-y-2 col-span-8 sm:col-span-4">
							<Form.Field config={{ form: form, schema: updateProfileSchema }} name="birthday">
								<Form.Item>
									<Form.Label>Birthday</Form.Label>
									<Form.Input type="date" />
									<Form.Validation />
								</Form.Item>
							</Form.Field>
						</div>
					</div>
				</div>

				<Separator />

				<!-- Location Section -->
				<div class="space-y-4">
					<h3 class="text-lg font-medium">Location</h3>

					<div class="space-y-2">
						<Form.Field config={{ form: form, schema: updateProfileSchema }} name="address">
							<Form.Item>
								<Form.Label>Address</Form.Label>
								<Form.Input />
								<Form.Validation />
							</Form.Item>
						</Form.Field>
					</div>

					<div class="grid grid-cols-8 gap-4">
						<div class="col-span-8 sm:col-span-4">
							<Form.Field config={{ form: form, schema: updateProfileSchema }} name="city">
								<Form.Item>
									<Form.Label>City</Form.Label>
									<Form.Input />
									<Form.Validation />
								</Form.Item>
							</Form.Field>
						</div>

						<div class="col-span-4 sm:col-span-2">
							<Form.Field config={{ form: form, schema: updateProfileSchema }} name="state">
								<Form.Control>
									<Form.Item>
										<Form.Label>State</Form.Label>
										<Form.Select
											preventScroll={false}
											selected={selectedState}
											onSelectedChange={(v) => {
												v && ($formData.state = String(v.value));
											}}
										>
											<Select.Trigger>
												<Select.Value />
											</Select.Trigger>
											<Select.Content class="max-h-[150px] overflow-y-scroll">
												{#each STATES as state}
													<Select.Item value={state.abbreviation}>
														<span>{state.abbreviation}</span>
													</Select.Item>
												{/each}
											</Select.Content>
											<Input type="hidden" value={$formData.state} name="state" />
										</Form.Select>
										<Form.Validation />
									</Form.Item>
								</Form.Control>
							</Form.Field>
						</div>

						<div class="col-span-4 sm:col-span-2">
							<Form.Field config={{ form: form, schema: updateProfileSchema }} name="zipcode">
								<Form.Item>
									<Form.Label>Zipcode</Form.Label>
									<Form.Input
										type="number"
										maxlength={5}
										on:input={(event) => {
											if (event.currentTarget.value.length > 5) {
												event.currentTarget.value = event.currentTarget.value.slice(0, 5);
											}
										}}
									/>
									<Form.Validation />
								</Form.Item>
							</Form.Field>
						</div>
						<div class="col-span-8 sm:col-span-4">
							<Form.Field config={{ form: form, schema: updateProfileSchema }} name="timezone">
								<Form.Label>Timezone</Form.Label>
								<p class="mt-4 text-muted-foreground">{formattedTimezone} - {$formData.timezone}</p>
								<Button
									variant="outline"
									class="mt-2"
									type="button"
									on:click={(e) => {
										e.preventDefault();
										$formData.timezone = browserTimezone;
										formattedTimezone = formatTimezoneName(browserTimezone);
									}}>Detect Timezone</Button
								>
								<Form.Input type="hidden" value={$formData.timezone} />
							</Form.Field>
						</div>
					</div>
				</div>

				<Separator />

				<!-- Rate Section -->
				<div class="space-y-4">
					<h3 class="text-lg font-medium">Hourly Rate Range</h3>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="space-y-2">
							<Form.Field config={{ form: form, schema: updateProfileSchema }} name="hourlyRateMin">
								<Form.Item>
									<Form.Label>Hourly Rate Min</Form.Label>
									<Form.Input type="number" />
									<Form.Validation />
								</Form.Item>
							</Form.Field>
						</div>

						<div class="space-y-2">
							<Form.Field config={{ form: form, schema: updateProfileSchema }} name="hourlyRateMax">
								<Form.Item>
									<Form.Label>Hourly Rate Max</Form.Label>
									<Form.Input type="number" />
									<Form.Validation />
								</Form.Item>
							</Form.Field>
						</div>
					</div>

					<p class="text-sm text-muted-foreground">
						Setting a rate range helps employers know your expectations. You can still negotiate
						specific rates for each position.
					</p>
				</div>

				<div class="flex justify-end pt-4">
					<Button disabled={$submitting} class="bg-green-400 hover:bg-green-500" type="submit">
						{#if $submitting}
							<Loader class="h-5 w-5 animate-spin" />
							Saving...
						{:else}
							Save Changes
						{/if}
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</section>
