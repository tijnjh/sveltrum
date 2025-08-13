<script lang='ts'>
  import type { Track } from '$lib/schemas/track'
  import { page } from '$app/state'
  import { getPlaylistById, getTracksByIds } from '$lib/api/get-by-id.remote'
  import Button from '$lib/components/Button.svelte'
  import TrackListing from '$lib/components/listings/TrackListing.svelte'
  import Spinner from '$lib/components/Spinner.svelte'

  const id = Number(page.params!.id)
  //  @ts-expect-error tla
  const playlist = await getPlaylistById(id)

  let isLoading = $state(false)

  let tracks = $state<Track[]>([])

  let currentIndex = $state(0)

  let hasMoreTracks = $state(true)

  async function doFetch() {
    if (!playlist.tracks)
      return

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
  <link rel='icon' href={playlist?.artwork_url} />
</svelte:head>

<main class='p-4 flex flex-col gap-4'>
  {#if playlist}
    <div class='flex items-center mb-8 gap-4 justify-start'>
      {#if playlist.artwork_url}
        <img src={playlist.artwork_url} class='rounded' alt='Album cover for {playlist.title}'>
      {/if}
      <hgroup>
        <h1 class='font-medium text-2xl'>{playlist.title}</h1>
        <p>{new Date(playlist.release_date!).getFullYear()}</p>
      </hgroup>
    </div>

    {#each tracks as track}
      <TrackListing {track} inAlbum={playlist.is_album} />
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
  {/if}
</main>
