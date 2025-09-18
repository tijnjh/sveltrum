<script lang="ts">
  import { getSelections } from "$lib/api/discovery.remote";
  import Button from "$lib/components/Button.svelte";
  import Main from "$lib/components/Main.svelte";
  import Spinner from "$lib/components/Spinner.svelte";
  import PlaylistListing from "$lib/components/listings/PlaylistListing.svelte";
</script>

<Main>
  <div class="my-16 flex flex-col gap-4">
    <h1 class="font-mediums mx-auto text-center text-3xl">Sveltrum</h1>
    <div class="flex justify-center gap-4">
      <Button href="https://tijn.dev/sveltrum">View on GitHub</Button>
    </div>
  </div>

  <h2 class="text-2xl font-medium">Trending playlists</h2>

  {#await getSelections()}
    <Spinner />
  {:then selections}
    {#each selections as selection (selection.items.collection[0].id)}
      {#each selection.items.collection as playlist (playlist.id)}
        <PlaylistListing {playlist} />
      {/each}
    {:else}
      <span class="mt-4 text-zinc-100/25 text-lg">Nothing here...</span>
    {/each}
  {/await}
</Main>
