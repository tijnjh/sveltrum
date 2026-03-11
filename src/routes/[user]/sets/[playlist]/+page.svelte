<script lang="ts">
  import { page } from "$app/state";
  import { resolvePlaylist } from "$lib/api/playlist.remote";
  import { getTracksByIds } from "$lib/api/track.remote";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import SkeletonListing from "$lib/components/listings/SkeletonListing.svelte";
  import { paginated_limit } from "$lib/constants";
  import { createInfiniteQuery, createQuery } from "@tanstack/svelte-query";
  import dedent from "dedent";

  const playlistQuery = createQuery(() => ({
    queryKey: ["playlist", page.params.user, page.params.playlist],
    queryFn: () =>
      resolvePlaylist({
        user: page.params.user!,
        playlist: page.params.playlist!,
      }),
  }));

  const query = createInfiniteQuery(() => ({
    queryKey: ["playlist-tracks", playlistQuery.data?.id],
    queryFn: ({ pageParam = 0 }) => {
      const allIds = playlistQuery.data?.tracks?.map((track) => track.id) ?? [];

      const startIdx = pageParam * paginated_limit;
      const endIdx = startIdx + paginated_limit;
      const idsChunk = allIds.slice(startIdx, endIdx);

      return getTracksByIds(idsChunk);
    },
    initialPageParam: 0,
    getNextPageParam: (_, allPages) => {
      const allIds = playlistQuery.data?.tracks?.map((track) => track.id) ?? [];
      const totalChunks = Math.ceil(allIds.length / paginated_limit);

      return allPages.length < totalChunks ? allPages.length : undefined;
    },
  }));
</script>

<svelte:head>
  <title>{playlistQuery.data?.title}</title>
  <meta
    name="description"
    content={dedent`${playlistQuery.data?.user.username}
               ${playlistQuery.data?.track_count} tracks
               ${playlistQuery.data?.created_at}
           `}
  />

  <link rel="icon" href={playlistQuery.data?.artwork_url} />
  <meta name="og:image" content={playlistQuery.data?.artwork_url} />
</svelte:head>

<Main>
  {#snippet left()}
    {#if playlistQuery.isPending}
      <HeroSection title="loading..." />
    {:else if playlistQuery.isError}
      <p>Error loading playlist.</p>
    {:else}
      <HeroSection
        pictureSrc={playlistQuery.data.artwork_url}
        title={playlistQuery.data.title}
        user={playlistQuery.data.user}
      />
    {/if}
  {/snippet}

  {#snippet right()}
    {#if playlistQuery.isPending}
      {#each { length: 20 }}
        <SkeletonListing />
      {/each}
    {:else if playlistQuery.isError}
      <p>Error loading playlist.</p>
    {:else}
      <InfiniteQueryView
        {query}
        orderedIds={playlistQuery.data?.tracks?.map((track) => track.id)}
      />
    {/if}
  {/snippet}
</Main>
