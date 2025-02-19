<script lang="ts">
	import Input from "$lib/components/ui/input/input.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { Trash } from "lucide-svelte";
	import type { PageData } from "./$types";
	export let data: PageData
	$: conversations = data.conversations
	$: console.log(conversations)
</script>
<section  class="container flex flex-col gap-6 pb-16 max-w-2xl">
    <h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
		Inbox
	</h1>
    <div class="flex justify-between items-center gap-4">
        <Input placeholder="Search Inbox"/>
        <!-- <Button><MessageSquarePlus /></Button> -->
    </div>

    <div class="divide-y-2">
        {#if conversations}
            {#each conversations as conversation}
                {#if conversation.type === "APPLICATION"}
                    <a href={`/inbox/${conversation.id}`}>
                        <div class="hover:bg-gray-100 p-4 flex items-center justify-between gap-8 cursor-pointer">
                            <div class="grow w-full">
                                <p class="font-semibold">{conversation.applicationData.requisition.title}</p>
                                <p class="text-sm">{conversation.applicationData.company.name}</p>
                                <p class="text-gray-400 text-sm">{new Date(conversation.lastMessage.createdAt).toLocaleString()}</p>
                                <p class="truncate max-w-[250px] sm:max-w-md mt-2">{conversation.lastMessage.body}</p>
                            </div>
                            <Button class="bg-transparent hover:bg-gray-50 group"><Trash class="text-gray-400 group-hover:text-red-400"/></Button>
                        </div>
                    </a>
                {/if}
            {/each}
        {/if}
    </div>
</section>
