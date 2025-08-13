<script lang='ts'>
  import Button from '$lib/components/Button.svelte'
  import PlaylistListing from '$lib/components/listings/PlaylistListing.svelte'
  import { getSelections } from '$lib/srv/api.remote'

  // @ts-expect-error tla
  const selections = await getSelections()
</script>

<div class='max-w-xl mx-auto p-4 flex flex-col gap-4'>
  <div class='my-16 flex flex-col gap-4'>
    <h1 class='mx-auto text-center text-3xl font-mediums'>Sveltrum</h1>
    <div class='flex gap-4 justify-center'>
      <!-- <Button href='/library'>Liked songs</Button> -->
      <Button href='https://tijn.dev/sveltrum'>View on GitHub</Button>
    </div>
  </div>

  <h2 class='text-2xl font-medium'>Trending playlists</h2>

  {#each selections as selection}
    {#each selection.items.collection as playlist}
      <PlaylistListing playlist={playlist} />
    {/each}
  {/each}
</div>
