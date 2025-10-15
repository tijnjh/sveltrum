<script lang="ts" generics="T extends Track | Playlist | User">
	import type { Playlist } from '$lib/schemas/playlist'
	import type { Track } from '$lib/schemas/track'
	import type { User } from '$lib/schemas/user'
	import { whenInView } from '$lib/utils'
	import Spinner from './Spinner.svelte'
	import PlaylistListing from './listings/PlaylistListing.svelte'
	import TrackListing from './listings/TrackListing.svelte'
	import UserListing from './listings/UserListing.svelte'
	import Button from './ui/Button.svelte'
	import type {
		CreateInfiniteQueryResult,
		InfiniteData,
	} from '@tanstack/svelte-query'

	const {
		query,
	}: {
		query: CreateInfiniteQueryResult<InfiniteData<T[], unknown>, Error>
	} = $props()
</script>

<div class="flex flex-col gap-4">
	{#each query.data?.pages as page (page)}
		{#each page as result (result.id)}
			{#if result.kind === 'track'}
				<TrackListing track={result as Track} />
			{:else if result.kind === 'playlist'}
				<PlaylistListing playlist={result as Playlist} />
			{:else if result.kind === 'user'}
				<UserListing user={result as User} />
			{/if}
		{/each}
	{:else}
		{#if !query.isLoading}
			<span class="mt-4 text-zinc-100/25 text-lg">Nothing here...</span>
		{/if}
	{/each}
</div>

{#if query.isLoading}
	<Spinner />
{:else if query.hasNextPage}
	<Button
		class="mt-8 w-full"
		onclick={() => {
			query.fetchNextPage()
		}}
		{@attach whenInView(() => {
			if (query.isFetching) return
			query.fetchNextPage()
		})}
	>
		Load more
	</Button>
{/if}
