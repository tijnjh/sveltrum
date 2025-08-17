<script lang='ts'>
  import type { Playlist } from '$lib/schemas/playlist'
  import type { Track } from '$lib/schemas/track'
  import type { Err, Ok } from 'dethrow'
  import { page } from '$app/state'
  import { getPlaylistById, getTracksByIds } from '$lib/api/get-by-id.remote'
  import Button from '$lib/components/Button.svelte'
  import TrackListing from '$lib/components/listings/TrackListing.svelte'
  import SafeRender from '$lib/components/SafeRender.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import { safeParseNumber } from '$lib/utils'
  import { err, isErr, newErr } from 'dethrow'

  const id = safeParseNumber(page.params!.id)

  if (isErr(id)) {
    console.error(id.err.message)
    playlist = err(id.err)
  }
  else {
    // @ts-expect-error
    playlist = await getPlaylistById(id.val)
  }

  let isLoading = $state(false)

  let tracks = $state<Track[]>([])

  let currentIndex = $state(0)

  let hasMoreTracks = $state(true)

  async function doFetch() {
    if (isErr(playlist))
      return err(playlist.err)

    if (!playlist.val.tracks)
      return

    isLoading = true

    const newTracks = await getTracksByIds({
      ids: playlist.val.tracks.map(({ id }) => id),
      index: currentIndex,
    })

    if (isErr(newTracks))
      return err(newTracks.err)

    hasMoreTracks = newTracks.val.hasMore

    tracks = [...tracks, ...newTracks.val.tracks]

    isLoading = false
  }

  doFetch()
</script>

<svelte:head>
  {#if !isErr(playlist)}
    <title>{playlist.val?.title} - {playlist.val?.user.username} &bull; sveltrum</title>
    <link rel='icon' href={playlist.val?.artwork_url} />
  {/if}
</svelte:head>

<SafeRender res={playlist}>
  {#snippet ok(p)}
    {#if p.artwork_url}
      <img src={p.artwork_url.replace('large', 't500x500')} class='w-full aspect-square md:max-w-md' alt="">
    {/if}

    <div class='flex flex-col z-50 gap-4 w-full sticky p-4 top-0 inset-x-0  bg-zinc-700/75 backdrop-blur-lg'>
      <h1 class='font-medium text-2xl'>{p.title}</h1>
    </div>

    <main class='p-4 flex flex-col gap-4'>

      {#each tracks as track}
        <TrackListing {track} inAlbum={p.is_album} />
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
  {/snippet}
</SafeRender>
