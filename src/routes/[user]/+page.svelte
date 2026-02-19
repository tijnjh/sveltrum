<script lang="ts">
  import { page } from "$app/state";
  import {
    getUserPlaylists,
    getUserTracks,
    resolveUser,
  } from "$lib/api/user.remote";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { paginated_limit } from "$lib/constants";
  import type { Playlist } from "$lib/schemas/playlist";
  import type { Track } from "$lib/schemas/track";
  import { createInfiniteQuery } from "@tanstack/svelte-query";
  import { useSearchParams } from "runed/kit";
  import * as v from "valibot";

  const user = await resolveUser(page.params.user!);

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
    queryKey: ["user", user.id, params.kind],
    queryFn: async ({ pageParam = 0 }) => {
      const data = {
        id: user.id,
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
  <title>{user.username}</title>
  <meta name="description" content={user.description} />
  <link rel="icon" href={user.avatar_url} />
  <meta name="og:image" content={user.avatar_url} />
</svelte:head>

<Main>
  {#snippet left()}
    <HeroSection
      pictureSrc={user.avatar_url}
      title={user.username}
      roundedPicture
    />
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
