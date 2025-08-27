<script lang='ts'>
  import { getSelections } from '$lib/api/discovery.remote'
  import Button from '$lib/components/Button.svelte'
  import PlaylistListing from '$lib/components/listings/PlaylistListing.svelte'
  import Main from '$lib/components/Main.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
</script>

<Main>
  <div class='my-16 flex flex-col gap-4'>
    <h1 class='mx-auto text-center text-3xl font-mediums'>Sveltrum</h1>
    <div class='flex gap-4 justify-center'>
      <Button href='https://tijn.dev/sveltrum'>View on GitHub</Button>
    </div>
  </div>

  <h2 class='text-2xl font-medium'>Trending playlists</h2>

  {#await getSelections()}
    <Spinner />
  {:then selections}
    {#each selections as selection}
      {#each selection.items.collection as playlist}
        <PlaylistListing playlist={playlist} />
      {/each}
    {/each}
  {/await}
</Main>
