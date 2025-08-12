<script lang='ts'>
  import type { Playlist } from '$lib/schemas/playlist'
  import ListingThumbnail from '../ListingThumbnail.svelte'

  const { playlist }: { playlist: Playlist } = $props()
</script>

<a
  href='/playlist/{playlist.id}'
  class='items-center text-left gap-4 grid grid-cols-[auto_1fr] active:scale-95 transition-transform active:opacity-50'
>
  <ListingThumbnail src={playlist.artwork_url} alt='Playlist picture of {playlist.title}' />
  <div class='flex flex-col w-full min-w-0'>
    <h3 class='truncate'>{playlist.title}</h3>
    <p class='truncate opacity-50'>{playlist.user.username}</p>
  </div>
</a>
