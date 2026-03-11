<script lang="ts">
  import { page } from "$app/state";
  import {
    getUserPlaylists,
    getUserTracks,
    resolveUser,
  } from "$lib/api/user.remote";
  import AsyncView from "$lib/components/AsyncView.svelte";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { paginated_limit } from "$lib/constants";
  import type { Playlist } from "$lib/schemas/playlist";
  import type { Track } from "$lib/schemas/track";
  import { createInfiniteQuery, createQuery } from "@tanstack/svelte-query";
  import { useSearchParams } from "runed/kit";
  import * as v from "valibot";

  const userQuery = createQuery(() => ({
    queryKey: ["user", page.params.user],
    queryFn: () => resolveUser(page.params.user!),
    enabled: !!page.params.user,
  }));

  const params = useSearchParams(
    v.object({
      kind: v.optional(v.picklist(["tracks", "playlists"]), "tracks"),
    }),
    {
      noScroll: true,
      pushHistory: false,
    },
  );

  const query = createInfiniteQuery(() => ({
    queryKey: ["user", userQuery.data?.id, params.kind],
    queryFn: async ({ pageParam = 0 }) => {
      const data = {
        id: userQuery.data!.id,
        offset: pageParam * paginated_limit,
        limit: paginated_limit,
      };
      let results: (Track | Playlist)[];
      switch (params.kind) {
        case "playlists":
          results = await getUserPlaylists(data);
          break;
        default:
          results = await getUserTracks(data);
          break;
      }
      return results;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 0 ? undefined : allPages.length,
  }));
</script>

<svelte:head>
  <title>{userQuery.data?.username}</title>
  <meta name="description" content={userQuery.data?.description} />
  <link rel="icon" href={userQuery.data?.avatar_url} />
  <meta name="og:image" content={userQuery.data?.avatar_url} />
</svelte:head>

<Main>
  {#snippet left()}
    <AsyncView data={userQuery.data} isLoading={userQuery.isPending}>
      {#snippet content(user)}
        <HeroSection
          pictureSrc={user!.avatar_url}
          title={user!.username}
          user={user!}
          roundedPicture
        />
      {/snippet}
    </AsyncView>
  {/snippet}

  {#snippet right()}
    <div class="flex gap-2">
      {#each ["tracks", "playlists"] as const as kind (kind)}
        <Button
          variant={params.kind === kind ? "primary" : "secondary"}
          class="capitalize"
          onclick={() => (params.kind = kind)}
        >
          {kind}
        </Button>
      {/each}
    </div>

    <InfiniteQueryView {query} />
  {/snippet}
</Main>
