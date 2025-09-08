<script lang='ts'>
  import type { Track } from '$lib/schemas/track'
  import { global } from '$lib/global.svelte'
  import ListingThumbnail from '../ListingThumbnail.svelte'

  const { track, inAlbum = false }: { track: Track, inAlbum?: boolean } = $props()
</script>

<button
  onclick={() => {
    global.nowPlaying = track

    setTimeout(() => {
      global.isPaused = false
    }, 50)
  }}
  class='items-center gap-4 grid grid-cols-[auto_1fr] active:opacity-50 text-left active:scale-95 transition-transform'
>
  {#if !inAlbum}
    <ListingThumbnail src={track.artwork_url} alt='album cover of {track.title}' />
  {/if}

  <div class='flex flex-col w-full min-w-0'>
    <div class='flex gap-2'>
      <h3 class='truncate'>{track.title}</h3>

      {#if track.policy === 'SNIP'}
        <div class='bg-zinc-700 px-2 py-0.5 rounded-full text-zinc-400 text-sm whitespace-nowrap'>30s only</div>
      {/if}
    </div>
    <p class='opacity-50 truncate'>
      {#if inAlbum}
        {track.playback_count?.toLocaleString()} plays
      {:else}
        {track.user?.username}
      {/if}
    </p>
  </div>
</button>
