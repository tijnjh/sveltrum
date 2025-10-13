<script lang="ts">
	import { getSelections } from '$lib/api/discovery.remote'
	import Button from '$lib/components/Button.svelte'
	import Main from '$lib/components/Main.svelte'
	import PlaylistListing from '$lib/components/listings/PlaylistListing.svelte'
	import UserListing from '$lib/components/listings/UserListing.svelte'

	const selections = await getSelections()
</script>

<Main>
	<div class="my-16 flex flex-col gap-4">
		<h1 class="font-mediums mx-auto text-center text-3xl">Sveltrum</h1>
		<div class="flex justify-center gap-4">
			<Button href="https://tijn.dev/sveltrum">View on GitHub</Button>
		</div>
	</div>

	<h2 class="text-2xl font-medium">Trending playlists</h2>

	{#each selections as selection (selection.items)}
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
</Main>
