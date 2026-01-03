<script lang="ts" generics="T extends Track | Playlist | User">
  import type { Playlist } from "$lib/schemas/playlist";
  import type { Track } from "$lib/schemas/track";
  import type { User } from "$lib/schemas/user";
  import { whenInView } from "$lib/utils";
  import Spinner from "./Spinner.svelte";
  import PlaylistListing from "./listings/PlaylistListing.svelte";
  import TrackListing from "./listings/TrackListing.svelte";
  import UserListing from "./listings/UserListing.svelte";
  import Button from "./ui/Button.svelte";
  import type {
    CreateInfiniteQueryResult,
    InfiniteData,
  } from "@tanstack/svelte-query";

  const {
    query,
    orderedIds,
  }: {
    query: CreateInfiniteQueryResult<InfiniteData<T[], unknown>, Error>;
    orderedIds?: number[];
  } = $props();

  const sortedPages = $derived.by(() => {
    if (!orderedIds) {
      return query.data?.pages ?? [];
    }

    return query.data?.pages.map((page) => {
      if (orderedIds.length === 0) return page;

      return page.sort((a, b) => {
        const ai = orderedIds.indexOf(a.id);
        const bi = orderedIds.indexOf(b.id);
        if (ai === -1 && bi === -1) return 0;
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });
    });
  });
</script>

{#if query.isLoading}
  <Spinner />
{/if}

<div class="flex flex-col gap-4">
  {#each sortedPages as page (page)}
    {#each page as result (result.id)}
      {#if result.kind === "track"}
        <TrackListing track={result as Track} />
      {:else if result.kind === "playlist"}
        <PlaylistListing playlist={result as Playlist} />
      {:else if result.kind === "user"}
        <UserListing user={result as User} />
      {/if}
    {/each}
  {:else}
    {#if !query.isLoading}
      <span class="mt-4 text-zinc-100/25 text-lg">Nothing here...</span>
    {/if}
  {/each}
</div>

{#if query.hasNextPage}
  <Button
    class="mt-8 w-full"
    onclick={() => {
      query.fetchNextPage();
    }}
    {@attach whenInView(() => {
      if (query.isFetching) return;
      query.fetchNextPage();
    })}
  >
    Load more
  </Button>
{/if}
