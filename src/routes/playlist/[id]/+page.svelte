<script lang="ts">
	import { page } from '$app/state'
	import { getPlaylistById, getTracksByIds } from '$lib/api/get-by-id.remote'
	import Button from '$lib/components/Button.svelte'
	import HeroSection from '$lib/components/HeroSection.svelte'
	import Main from '$lib/components/Main.svelte'
	import Spinner from '$lib/components/Spinner.svelte'
	import TrackListing from '$lib/components/listings/TrackListing.svelte'
	import type { Track } from '$lib/schemas/track'

	const id = Number(page.params!.id)

	const playlist = await getPlaylistById(id)

	let isLoading = $state(false)

	let tracks = $state<Track[]>([])

	let currentIndex = $state(0)

	let hasMoreTracks = $state(true)

	async function doFetch() {
		if (!playlist.tracks) {
			return
		}

		isLoading = true

		const { tracks: newTracks, hasMore } = await getTracksByIds({
			ids: playlist.tracks.map(({ id }) => id),
			index: currentIndex,
		})

		hasMoreTracks = hasMore

		tracks = [...tracks, ...newTracks]

		isLoading = false
	}

	doFetch()
</script>

<svelte:head>
	<title>{playlist?.title} - {playlist?.user.username} &bull; sveltrum</title>
	<link rel="icon" href={playlist?.artwork_url} />
</svelte:head>

<Main>
	<HeroSection
		pictureSrc={playlist.artwork_url}
		title={playlist.title}
		user={playlist.user}
	/>

	<h2 class="mt-4 text-2xl font-medium">
		{playlist.track_count} track{playlist.track_count === 1 ? '' : 's'}
	</h2>

	{#each tracks as track (track.id)}
		<TrackListing {track} inAlbum={playlist.is_album} />
	{:else}
		{#if !isLoading}
			<span class="mt-4 text-zinc-100/25 text-lg"> Nothing here... </span>
		{/if}
	{/each}

	{#if isLoading}
		<Spinner />
	{:else if hasMoreTracks}
		<Button
			class="mt-8 w-full"
			onclick={() => {
				currentIndex++
				doFetch()
			}}
		>
			Load more
		</Button>
	{/if}
</Main>
