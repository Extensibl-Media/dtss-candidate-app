<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as Form from '$lib/components/ui/form';
  import * as Select from "$lib/components/ui/select";
  import * as Alert from '$lib/components/ui/alert';
  import { AlertCircle, Loader } from 'lucide-svelte';
  import Input from '$lib/components/ui/input/input.svelte';
  import { newProfileSchema } from '$lib/config/zod-schemas';
  import type { PageData } from './$types';
  import {STATES} from '$lib/config/constants';
  import { superForm } from 'sveltekit-superforms/client';
  import Button from '$lib/components/ui/button/button.svelte';
	import AvatarUpload from '$lib/components/general/avatar-upload.svelte';
	import { tick } from 'svelte';


  export let data: PageData
  $: user = data.user

  const form = superForm(data.form)
  const avatarForm = superForm(data.avatarForm)

  const { enhance, form: formData, errors, submitting } = form
  const { form: formAvatar, enhance: avatarEnhance, errors: avatarError } = avatarForm
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
  <title>Profile Setup | DentalStaff.US</title>
</svelte:head>

<section class="sm:container grid items-center gap-6 max-w-2xl">
	<Card.Root class="border-0 sm:border">
	<Card.Header class="space-y-1">
		<Card.Title class="text-2xl">Let's set up your profile</Card.Title>
		<Card.Description>Enter your profile settings below.</Card.Description>
	</Card.Header>
	<Card.Content>
	<AvatarUpload {user} onAvatarUpdated={handleAvatarUpdated} />
        <form id="avatar-url-form" class="hidden" method="POST" action="?/avatarUpload" use:avatarEnhance>
            <input type="hidden" name="url" bind:value={$formAvatar.url}/>
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
    <form id="profileForm" action="?/submitProfile" method="POST" use:enhance>
        <div  class="grid gap-2 grid-cols-8">
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
        <div class="col-span-8">
            <Form.Field config={{form: form, schema: newProfileSchema}} name="address">
                <Form.Item>
                    <Form.Label>Address</Form.Label>
                    <Form.Input />
                    <Form.Validation />
                </Form.Item>
            </Form.Field>
        </div>
        <div class="col-span-8 sm:col-span-4">
            <Form.Field config={{form: form, schema: newProfileSchema}} name="city">
                <Form.Item>
                    <Form.Label>City</Form.Label>
                    <Form.Input />
                    <Form.Validation />
                </Form.Item>
            </Form.Field>
        </div>
        <div class="col-span-4 sm:col-span-2">
            <Form.Field config={{form: form, schema: newProfileSchema}} name="state">
                <Form.Control>
                    <Form.Item>
                        <Form.Label>State</Form.Label>
                        <Form.Select preventScroll={false}
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
                                <Input type="hidden" value={$formData.state} name="state"/>
                        </Form.Select>
                        <Form.Validation/>
                    </Form.Item>
                </Form.Control>
            </Form.Field>
        </div>
        <div class="col-span-4 sm:col-span-2">
            <Form.Field config={{form: form, schema: newProfileSchema}} name="zipcode">
                <Form.Item>
                    <Form.Label>Zipcode</Form.Label>
                    <Form.Input type="number" maxlength={5} on:input={(event) => {
                      if(event.currentTarget.value.length > 5){
                        event.currentTarget.value = event.currentTarget.value.slice(0, 5)
                      }
                    }}/>
                    <Form.Validation />
                </Form.Item>
            </Form.Field>
        </div>
        <div class="col-span-8 sm:col-span-4">
            <Form.Field config={{form: form, schema: newProfileSchema}} name="birthday">
                <Form.Item>
                    <Form.Label>Birthday</Form.Label>
                    <Form.Input type="date" />
                    <Form.Validation />
                </Form.Item>
            </Form.Field>
        </div>
        <div class="col-span-8 sm:col-span-4">
            <Form.Field config={{form: form, schema: newProfileSchema}} name="cellPhone">
                <Form.Item>
                    <Form.Label>Cell Phone #</Form.Label>
                    <Form.Input type="tel"
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
                            formatted = `${trimmed.slice(0, 3)}-${trimmed.slice(3, 6)}-${trimmed.slice(6)}`;
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
        <div class="col-span-4">
            <Form.Field config={{form: form, schema: newProfileSchema}} name="hourlyRateMin">
                <Form.Item>
                    <Form.Label>Hourly Rate Min</Form.Label>
                    <Form.Input type="number" />
                    <Form.Validation />
                </Form.Item>
            </Form.Field>
        </div>
        <div class="col-span-4">
            <Form.Field config={{form: form, schema: newProfileSchema}} name="hourlyRateMax">
                <Form.Item>
                    <Form.Label>Hourly Rate Max</Form.Label>
                    <Form.Input type="number" />
                    <Form.Validation />
                </Form.Item>
            </Form.Field>
        </div>
        </div>
    </form>
	</Card.Content>
	<Card.Footer>
            <Button type="submit" form={"profileForm"} class="w-full sm:w-fit ml-auto bg-blue-800 hover:bg-blue-900">
                {#if $submitting}
                    <Loader class="animate-spin h-4 w-4 mr-2" />
                    Saving...
                {:else}
                    Save Profile
                {/if}
            </Button>
	</Card.Footer>
	</Card.Root>
</section>
