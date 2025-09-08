<script module lang='ts'>
  import type { Playlist } from '$lib/schemas/playlist'

  export interface PlaylistListingProps {
    playlist: Playlist
  }
</script>

<script lang='ts'>
  import ListingThumbnail from '../ListingThumbnail.svelte'

  const { playlist }: PlaylistListingProps = $props()
</script>

<a
  href='/playlist/{playlist.id}'
  class='items-center gap-4 grid grid-cols-[auto_1fr] active:opacity-50 text-left active:scale-95 transition-transform'
>
  <ListingThumbnail src={playlist.artwork_url} alt='Playlist picture of {playlist.title}' />

  <div class='flex flex-col w-full min-w-0'>
    <div class='flex gap-2'>
      <h3 class='truncate'>{playlist.title}</h3>
      {#if playlist.is_album}
        <div class='bg-zinc-700 px-2 py-0.5 rounded-full text-zinc-400 text-sm whitespace-nowrap'>Album</div>
      {/if}
    </div>
    <p class='opacity-50 truncate'>{playlist.user.username}</p>
  </div>
</a>
