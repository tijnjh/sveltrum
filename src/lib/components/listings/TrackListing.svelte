<script lang='ts'>
  import type { Track } from '$lib/schemas/track'
  import { global } from '$lib/global.svelte'

  const { track, inAlbum = false }: { track: Track, inAlbum?: boolean } = $props()
</script>

<button
  onclick={() => { global.nowPlaying = track }}
  class='items-center text-left gap-4 grid grid-cols-[auto_1fr] active:scale-95 transition-transform active:opacity-50'
>
  {#if !inAlbum}
    {#if track.artwork_url}
      <img src={track.artwork_url} alt='Album cover for {track.title}' class='rounded size-12 aspect-square'>
    {:else}
      <div class='rounded size-12 aspect-square'></div>
    {/if}
  {/if}
  <div class='flex flex-col w-full min-w-0'>
    <h3 class='truncate'>{track.title}</h3>
    <p class='truncate opacity-50'>{track.user?.username}</p>
  </div>
</button>
