<script module lang="ts">
  import type { Playlist } from "$lib/schemas/playlist";

  export interface PlaylistListingProps {
    playlist: Playlist;
  }
</script>

<script lang="ts">
  import ListingThumbnail from "../ListingThumbnail.svelte";

  const { playlist }: PlaylistListingProps = $props();
</script>

<a
  href="/playlist/{playlist.id}"
  class="grid grid-cols-[auto_1fr] items-center gap-4 text-left transition-transform active:scale-95 active:opacity-50"
>
  <ListingThumbnail
    src={playlist.artwork_url}
    alt="Playlist picture of {playlist.title}"
  />

  <div class="flex w-full min-w-0 flex-col">
    <div class="flex gap-2">
      <h3 class="truncate">{playlist.title}</h3>
      {#if playlist.is_album}
        <div
          class="rounded-full bg-zinc-700 px-2 py-0.5 text-sm whitespace-nowrap text-zinc-400"
        >
          Album
        </div>
      {/if}
    </div>
    <p class="truncate opacity-50">{playlist.user.username}</p>
  </div>
</a>
