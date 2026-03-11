<script lang="ts">
  import { getSelections } from "$lib/api/discovery.remote";
  import { getTracksByIds } from "$lib/api/track.remote";
  import Main from "$lib/components/Main.svelte";
  import PlaylistListing from "$lib/components/listings/PlaylistListing.svelte";
  import SkeletonListing from "$lib/components/listings/SkeletonListing.svelte";
  import TrackListing from "$lib/components/listings/TrackListing.svelte";
  import UserListing from "$lib/components/listings/UserListing.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { favoriteTrackIds } from "$lib/global.svelte";
  import { SearchIcon } from "@lucide/svelte";
  import { createQuery } from "@tanstack/svelte-query";

  const selectionsQuery = createQuery(() => ({
    queryKey: ["selections"],
    queryFn: () => getSelections(),
  }));

  const favoritesQuery = createQuery(() => ({
    queryKey: ["favorites", favoriteTrackIds],
    queryFn: () => getTracksByIds(favoriteTrackIds.current),
  }));
</script>

<Main class="mt-16">
  {#snippet left()}
    <div class="flex w-full flex-col items-start gap-4">
      <div class="flex w-full items-center justify-between">
        <h1 class="text-3xl font-medium">Cloudscape</h1>
        <Button variant="secondary" href="https://tijn.dev/cloudscape">
          View on GitHub
        </Button>
      </div>

      <form action="search" class="w-full">
        <Input
          type="text"
          name="q"
          placeholder="Search for artists, tracks or playlists..."
          class="w-full"
          icon={SearchIcon}
        />
      </form>
    </div>

    <h2
      title="These are saved in localstorage"
      class="mt-8 text-2xl font-medium"
    >
      Your Favorites
    </h2>

    {#if favoritesQuery.isPending}
      {#each { length: favoriteTrackIds.current.length }}
        <SkeletonListing />
      {/each}
    {:else}
      {#each favoritesQuery.data as favorite (favorite.id)}
        <TrackListing track={favorite} />
      {/each}
    {/if}
  {/snippet}
  {#snippet right()}
    {#if selectionsQuery.isPending}
      <h3 class="animate-pulse text-2xl font-medium">Loading</h3>

      {#each { length: 20 }}
        <SkeletonListing />
      {/each}
    {:else}
      {#each selectionsQuery.data as selection (selection.items)}
        <h3 class="text-2xl font-medium">
          {selection.title}
        </h3>

        {#each selection.items.collection as item}
          {#if item.kind === "playlist"}
            <PlaylistListing playlist={item} />
          {:else if item.kind === "user"}
            <UserListing user={item} />
          {/if}
        {/each}
        <br />
      {:else}
        <span class="mt-4 text-mist-100/25 text-lg">Nothing here...</span>
      {/each}
    {/if}
  {/snippet}
</Main>
