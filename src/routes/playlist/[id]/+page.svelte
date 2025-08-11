<script lang='ts'>
  import { page } from '$app/state'
  import TrackListing from '$lib/components/listings/TrackListing.svelte'
  import { getPlaylistById, getTracksByIds } from '$lib/srv/api.remote'

  const id = Number(page.params!.id)
  // @ts-expect-error stfu vro
  const playlist = await getPlaylistById(id)
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
    {@const ids = playlist.tracks.map(({ id }) => id)}
    {#await getTracksByIds(ids) then tracks}
      {#if tracks}
        {#each tracks as track}
          <TrackListing {track} inAlbum />
        {/each}
      {/if}

    {/await}
  {/if}
</main>
