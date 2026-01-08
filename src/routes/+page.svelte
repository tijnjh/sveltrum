<script lang="ts">
  import { getSelections } from "$lib/api/discovery.remote";
  import { getTracksByIds } from "$lib/api/track.remote";
  import Shell from "$lib/components/Shell.svelte";
  import PlaylistListing from "$lib/components/listings/PlaylistListing.svelte";
  import TrackListing from "$lib/components/listings/TrackListing.svelte";
  import UserListing from "$lib/components/listings/UserListing.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { favoriteTrackIds } from "$lib/global.svelte";
  import { GithubIcon, SearchIcon } from "@lucide/svelte";
  import { resource } from "runed";

  const selections = await getSelections();

  const favorites = resource(
    () => favoriteTrackIds.current,
    () => getTracksByIds(favoriteTrackIds.current),
  );
</script>

<Shell>
  {#snippet left()}
    <div class="flex w-full flex-col items-start gap-4">
      <div class="flex w-full items-center justify-between">
        <h1 class="text-3xl font-medium">Sveltrum</h1>
        <Button href="https://tijn.dev/sveltrum" size="icon">
          <GithubIcon />
        </Button>
      </div>

      <form action="search" class="w-full">
        <Input
          type="text"
          name="q"
          placeholder="Search"
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

    {#each favorites.current as favorite (favorite.id)}
      <TrackListing track={favorite} />
    {/each}
  {/snippet}
  {#snippet right()}
    {#each selections as selection (selection.items)}
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
      <span class="mt-4 text-zinc-100/25 text-lg">Nothing here...</span>
    {/each}
  {/snippet}
</Shell>
