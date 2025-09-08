<script lang='ts'>
  import { getSelections } from '$lib/api/discovery.remote'
  import Button from '$lib/components/Button.svelte'
  import PlaylistListing from '$lib/components/listings/PlaylistListing.svelte'
  import Main from '$lib/components/Main.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
</script>

<Main>
  <div class='flex flex-col gap-4 my-16'>
    <h1 class='mx-auto font-mediums text-3xl text-center'>Sveltrum</h1>
    <div class='flex justify-center gap-4'>
      <Button href='https://tijn.dev/sveltrum'>View on GitHub</Button>
    </div>
  </div>

  <h2 class='font-medium text-2xl'>Trending playlists</h2>

  {#await getSelections()}
    <Spinner />
  {:then selections}
    {#each selections as selection}
      {#each selection.items.collection as playlist}
        <PlaylistListing playlist={playlist} />
      {/each}
    {:else}
      <span class='mt-4 text-zinc-100/25 text-lg'>
        Nothing here...
      </span>
    {/each}
  {/await}
</Main>
