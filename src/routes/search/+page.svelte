<script lang="ts">
  import {
    searchTracks,
    searchPlaylists,
    searchUsers,
  } from "$lib/api/search.remote";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { paginated_limit } from "$lib/constants";
  import type { Playlist } from "$lib/schemas/playlist";
  import type { Track } from "$lib/schemas/track";
  import type { User } from "$lib/schemas/user";
  import { SearchIcon } from "@lucide/svelte";
  import { createInfiniteQuery } from "@tanstack/svelte-query";
  import { Debounced } from "runed";
  import { useSearchParams } from "runed/kit";
  import { match } from "ts-pattern";
  import * as v from "valibot";

  const params = useSearchParams(
    v.object({
      q: v.optional(v.string(), ""),
      kind: v.optional(v.picklist(["tracks", "playlists", "users"]), "tracks"),
    }),
    {
      noScroll: true,
      pushHistory: false,
    },
  );

  const debouncedQ = new Debounced(() => params.q, 500);

  type Listing = Track | Playlist | User;

  const query = createInfiniteQuery(() => ({
    queryKey: ["search", debouncedQ.current, params.kind],
    queryFn: async ({ pageParam }) => {
      if (!debouncedQ.current) return [] as Listing[];

      const searchFn = match(params.kind)
        .with("tracks", () => searchTracks)
        .with("playlists", () => searchPlaylists)
        .with("users", () => searchUsers)
        .exhaustive();

      return searchFn({
        query: debouncedQ.current,
        offset: pageParam * paginated_limit,
        limit: paginated_limit,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < paginated_limit ? allPages.length : undefined,
  }));
</script>

<svelte:head>
  <title>results for '{debouncedQ.current}' - sveltrum</title>
</svelte:head>

<Main>
  {#snippet left()}
    <form
      onsubmit={(e) => {
        e.preventDefault();
        query.refetch();
      }}
      class="mx-auto flex w-full max-w-xl gap-2"
    >
      <Input
        type="text"
        bind:value={params.q}
        class="w-full"
        placeholder="Search"
        icon={SearchIcon}
      />
    </form>

    <div class="mx-auto flex w-full max-w-xl gap-2">
      {#each ["tracks", "playlists", "users"] as const as kind (kind)}
        {#key params.kind}
          <Button
            variant={params.kind === kind ? "primary" : "secondary"}
            class="capitalize"
            onclick={() => {
              params.kind = kind;
              query.refetch();
            }}
          >
            {kind}
          </Button>
        {/key}
      {/each}
    </div>
  {/snippet}

  {#snippet right()}
    <InfiniteQueryView {query} />
  {/snippet}
</Main>
