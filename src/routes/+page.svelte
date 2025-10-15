<script lang="ts">
	import { getSelections } from '$lib/api/discovery.remote'
	import Main from '$lib/components/Main.svelte'
	import PlaylistListing from '$lib/components/listings/PlaylistListing.svelte'
	import UserListing from '$lib/components/listings/UserListing.svelte'
	import Button from '$lib/components/ui/Button.svelte'
	import Input from '$lib/components/ui/Input.svelte'
	import { SearchIcon } from '@lucide/svelte'

	const selections = await getSelections()
</script>

<Main class="mt-16">
	{#snippet left()}
		<div class="flex w-full flex-col items-start gap-4">
			<h1 class="text-3xl font-medium">Sveltrum</h1>

			<form action="search" class="w-full">
				<Input
					type="text"
					name="q"
					placeholder="Search for artists, tracks or playlists..."
					class="w-full"
					icon={SearchIcon}
				/>
			</form>

			<div class="flex justify-center gap-4">
				<Button href="https://tijn.dev/sveltrum">View on GitHub</Button>
			</div>
		</div>
	{/snippet}
	{#snippet right()}
		<h2 class="text-2xl font-medium">Trending</h2>

		{#each selections as selection (selection.items)}
			<h3 class="mt-4 text-lg font-medium">
				{selection.title}
			</h3>

			{#each selection.items.collection as item (item.id)}
				{#if item.kind === 'playlist'}
					<PlaylistListing playlist={item} />
				{:else if item.kind === 'user'}
					<UserListing user={item} />
				{/if}
			{/each}
		{:else}
			<span class="mt-4 text-zinc-100/25 text-lg">Nothing here...</span>
		{/each}
	{/snippet}
</Main>
