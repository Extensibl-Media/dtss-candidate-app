<script lang="ts">
  import * as Card from '$lib/components/ui/card';
  import * as Alert from '$lib/components/ui/alert';
  import * as Select from "$lib/components/ui/select";
  import { AlertCircle } from 'lucide-svelte';
  import Input from '$lib/components/ui/input/input.svelte';
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';
  import Button from '$lib/components/ui/button/button.svelte';
  import { Separator } from '$lib/components/ui/separator';

  export let data: PageData;
  $: disciplines = data.disciplines;
  $: experienceLevels = data.experienceLevels;

  const form = superForm(data.form, {
    dataType: 'json'
  });
  const { enhance, form: formData, errors } = form;

  // Initialize disciplines array if it doesn't exist
  $: if (!$formData.disciplines) {
    $formData.disciplines = [];
  }

  // Search/filter functionality
  let searchTerm = '';
  $: filteredDisciplines = searchTerm
    ? disciplines.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : disciplines;

  // Check if a discipline is already selected
  function isDisciplineSelected(disciplineId: string) {
    return $formData.disciplines.some(d => d.disciplineId === disciplineId);
  }

  // Add a discipline to the selected list
  function addDiscipline(disciplineId: string) {
    if (!isDisciplineSelected(disciplineId)) {
      $formData.disciplines = [
        ...$formData.disciplines,
        {
          disciplineId,
          experienceLevelId: experienceLevels.length > 0 ? experienceLevels[0].id : ''
        }
      ];
    }
  }

  // Remove a discipline from the selected list
  function removeDiscipline(disciplineId: string) {
    $formData.disciplines = $formData.disciplines.filter(d => d.disciplineId !== disciplineId);
  }

  // Update experience level for a discipline
  function updateExperienceLevel(disciplineId: string, experienceLevel: {value: string; label: string; disabled: boolean}) {

    console.log(experienceLevel)
    $formData.disciplines = $formData.disciplines.map(d =>
      d.disciplineId === disciplineId
        ? { ...d, experienceLevelId: experienceLevel.value }
        : d
    );
  }

  // Get discipline name by ID
  function getDisciplineName(disciplineId: string) {
    const discipline = disciplines.find(d => d.id === disciplineId);
    return discipline ? discipline.name : 'Unknown Discipline';
  }

  $: sortedExperienceLevels = [...experienceLevels].sort((a, b) => {
      // Define a priority order
      const priorityMap = {
        '0-2 Years': 1,
        '2-5 Years': 2,
        '5-7 Years': 3,
        '7-10 Years': 4,
        '10+ years': 5
      };

      // Get priorities (defaulting to 999 if not found)
      const priorityA = priorityMap[a.value] || 999;
      const priorityB = priorityMap[b.value] || 999;

      // Sort by priority
      return priorityA - priorityB;
    });

  $: disciplineString = JSON.stringify($formData.disciplines);
</script>

<svelte:head>
  <title>Add Your Experience | DentalStaff.US</title>
</svelte:head>

<section class="sm:container grid items-center gap-6 max-w-2xl">
  <Card.Root class="border-0 sm:border">
    <Card.Header class="space-y-1">
      <Card.Title class="text-2xl">Add your work experience</Card.Title>
      <Card.Description>Select the disciplines you have experience in and specify your experience level for each.</Card.Description>
    </Card.Header>
    <Card.Content>
      <form id="experienceForm" action="?/submitExperience" method="POST" use:enhance>
        <input type="hidden" bind:value={disciplineString} name="disciplines"/>
        <div class="grid gap-4">
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

          <!-- Search box -->
          <div class="mb-4">
            <label for="search" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Search Disciplines
            </label>
            <Input
              id="search"
              type="text"
              placeholder="Search by name..."
              bind:value={searchTerm}
              class="w-full mt-1.5"
            />
          </div>

          <!-- Available Disciplines List -->
          <div class="border rounded-md p-4">
            <p class="text-sm font-medium leading-none mb-2 block">
              Available Disciplines
            </p>
            {#if filteredDisciplines.length === 0}
              <p class="text-sm text-gray-500">No matching disciplines found</p>
            {:else}
              <div class="max-h-60 overflow-y-auto">
                {#each filteredDisciplines as discipline}
                  <div class="flex items-center justify-between py-2 hover:bg-gray-50 px-2 rounded">
                    <span class="text-sm">{discipline.name}</span>
                    <Button
                      type="button"
                      variant={isDisciplineSelected(discipline.id) ? "destructive" : "outline"}
                      size="sm"
                      on:click={() => isDisciplineSelected(discipline.id)
                        ? removeDiscipline(discipline.id)
                        : addDiscipline(discipline.id)}
                    >
                      {isDisciplineSelected(discipline.id) ? "Remove" : "Add"}
                    </Button>
                  </div>
                {/each}
              </div>
            {/if}
          </div>

          {#if $errors.disciplines?._errors?.length}
            <p class="text-sm text-red-500">{$errors.disciplines._errors[0]}</p>
          {/if}

          <!-- Selected Disciplines with Experience Level Selection -->
          <div class="mt-6">
            <h3 class="text-sm font-medium leading-none mb-3">Selected Disciplines</h3>

            {#if $formData.disciplines.length === 0}
              <p class="text-sm text-gray-500">No disciplines selected yet</p>
            {:else}
              <div class="space-y-3 border rounded-md p-4">
                {#each $formData.disciplines as discipline, index}
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2">
                    <div class="font-medium">{getDisciplineName(discipline.disciplineId)}</div>

                    <div class="flex items-center gap-2">
                      <Select.Root
                        onSelectedChange={(value) => updateExperienceLevel(discipline.disciplineId, value)}
                      >
                        <Select.Trigger class="max-w-[300px]">
                          <Select.Value placeholder="Select experience" />
                        </Select.Trigger>
                        <Select.Content>
                          {#each sortedExperienceLevels as level}
                            <Select.Item value={level.id}>{level.value}</Select.Item>
                          {/each}
                        </Select.Content>
                      </Select.Root>

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        on:click={() => removeDiscipline(discipline.disciplineId)}
                      >
                        <span class="sr-only">Remove</span>
                        ×
                      </Button>
                    </div>
                  </div>

                  {#if index < $formData.disciplines.length - 1}
                    <Separator />
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </form>
    </Card.Content>
    <Card.Footer>
      <Button
        type="submit"
        form="experienceForm"
        class="w-full sm:w-fit ml-auto bg-blue-800 hover:bg-blue-900"
      >
        Submit Experience
      </Button>
    </Card.Footer>
  </Card.Root>
</section>
