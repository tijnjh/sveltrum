<script module lang="ts">
  import type { Track } from "$lib/schemas/track";

  export interface TrackListingProps {
    track: Track;
    inAlbum?: boolean;
  }
</script>

<script lang="ts">
  import { global } from "$lib/global.svelte";
  import ListingThumbnail from "../ListingThumbnail.svelte";

  const { track, inAlbum = false }: TrackListingProps = $props();
</script>

<button
  onclick={() => {
    global.nowPlaying = track;

    setTimeout(() => {
      global.isPaused = false;
    }, 50);
  }}
  class="grid grid-cols-[auto_1fr] items-center gap-4 text-left transition-transform active:scale-95 active:opacity-50"
>
  {#if !inAlbum}
    <ListingThumbnail
      src={track.artwork_url}
      alt="album cover of {track.title}"
    />
  {/if}

  <div class="flex w-full min-w-0 flex-col">
    <div class="flex gap-2">
      <h3 class="truncate">{track.title}</h3>

      {#if track.policy === "SNIP"}
        <div
          class="rounded-full bg-zinc-700 px-2 py-0.5 text-sm whitespace-nowrap text-zinc-400"
        >
          30s only
        </div>
      {/if}
    </div>
    <p class="truncate opacity-50">
      {#if inAlbum}
        {track.playback_count?.toLocaleString()} plays
      {:else}
        {track.user?.username}
      {/if}
    </p>
  </div>
</button>
