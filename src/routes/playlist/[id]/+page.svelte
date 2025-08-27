<script lang='ts'>
  import type { Playlist } from '$lib/schemas/playlist'
  import type { Track } from '$lib/schemas/track'
  import { page } from '$app/state'
  import { getPlaylistById, getTracksByIds } from '$lib/api/get-by-id.remote'
  import Button from '$lib/components/Button.svelte'
  import TrackListing from '$lib/components/listings/TrackListing.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import { err } from 'neverthrow'
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'

  const id = Number(page.params!.id)

  let playlist: Playlist | null = $state(null)

  let isLoading = $state(false)

  let tracks = $state<Track[]>([])

  let currentIndex = $state(0)

  let hasMoreTracks = $state(true)

  onMount(async () => {
    const res = await getPlaylistById(id)

    if (res.isErr()) {
      toast.error(`failed to get playlist: ${res.error}`)
      return
    }

    playlist = res.value
  })

  async function doFetch() {
    if (!playlist?.tracks) {
      return
    }

    isLoading = true

    const newTracks = await getTracksByIds({
      ids: playlist.tracks.map(({ id }) => id),
      index: currentIndex,
    })

    if (newTracks.isErr()) {
      return err(newTracks.error)
    }

    hasMoreTracks = newTracks.value.hasMore

    tracks = [...tracks, ...newTracks.value.tracks]

    isLoading = false
  }

  doFetch()
</script>

<svelte:head>
  <title>{playlist?.title} - {playlist?.user.username} &bull; sveltrum</title>
  <link rel='icon' href={playlist?.artwork_url} />
</svelte:head>

{#if playlist?.artwork_url}
  <img src={playlist.artwork_url.replace('large', 't500x500')} class='w-full aspect-square md:max-w-md' alt="">
{/if}

<div class='flex flex-col z-50 gap-4 w-full sticky p-4 top-0 inset-x-0  bg-zinc-700/75 backdrop-blur-lg'>
  <h1 class='font-medium text-2xl'>{playlist?.title}</h1>
</div>

<main class='p-4 flex flex-col gap-4'>

  {#each tracks as track}
    <TrackListing {track} inAlbum={playlist?.is_album} />
  {/each}

  {#if isLoading}
    <Spinner />
  {:else if hasMoreTracks}
    <Button
      class='w-full mt-8'
      onclick={() => {
        currentIndex++
        doFetch()
      }}
    >
      Load more
    </Button>
  {/if}
</main>
