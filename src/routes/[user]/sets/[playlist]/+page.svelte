<script lang="ts">
	import { page } from '$app/state'
	import { resolvePlaylist } from '$lib/api/playlist.remote'
	import { getTracksByIds } from '$lib/api/track.remote'
	import HeroSection from '$lib/components/HeroSection.svelte'
	import Main from '$lib/components/Main.svelte'
	import Spinner from '$lib/components/Spinner.svelte'
	import TrackListing from '$lib/components/listings/TrackListing.svelte'
	import Button from '$lib/components/ui/Button.svelte'
	import { whenInView } from '$lib/utils'
	import { createInfiniteQuery } from '@tanstack/svelte-query'

	const playlist = await resolvePlaylist({
		user: page.params.user!,
		playlist: page.params.playlist!,
	})

	const query = createInfiniteQuery(() => ({
		queryKey: ['playlist-tracks', playlist.id],
		queryFn: ({ pageParam = 0 }) =>
			getTracksByIds({
				ids: playlist.tracks?.map((track) => track.id) ?? [],
				index: pageParam,
			}),
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasMore ? allPages.length : undefined,
	}))
</script>

<svelte:head>
	<title>{playlist?.title} - {playlist?.user.username} &bull; sveltrum</title>
	<link rel="icon" href={playlist?.artwork_url} />
</svelte:head>

<Main>
	{#snippet left()}
		<HeroSection
			pictureSrc={playlist.artwork_url}
			title={playlist.title}
			user={playlist.user}
		/>
	{/snippet}

	{#snippet right()}
		<h2 class="mt-4 text-2xl font-medium">
			{playlist.track_count} track{playlist.track_count === 1 ? '' : 's'}
		</h2>

		{#each query.data?.pages as page (page)}
			{#each page.tracks as track (track.id)}
				<TrackListing {track} inAlbum={playlist.is_album} />
			{/each}
		{:else}
			{#if !query.isLoading}
				<span class="mt-4 text-zinc-100/25 text-lg"> Nothing here... </span>
			{/if}
		{/each}

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
	{/snippet}
</Main>
