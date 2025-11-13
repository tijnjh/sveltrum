<script lang="ts">
  import { page } from "$app/state";
  import { resolvePlaylist } from "$lib/api/playlist.remote";
  import { getTracksByIds } from "$lib/api/track.remote";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import { paginated_limit } from "$lib/constants";
  import { createInfiniteQuery } from "@tanstack/svelte-query";
  import dedent from "dedent";

  const playlist = await resolvePlaylist({
    user: page.params.user!,
    playlist: page.params.playlist!,
  });

  const query = createInfiniteQuery(() => ({
    queryKey: ["playlist-tracks", playlist.id],
    queryFn: ({ pageParam = 0 }) => {
      const allIds = playlist.tracks?.map((track) => track.id) ?? [];

      const startIdx = pageParam * paginated_limit;
      const endIdx = startIdx + paginated_limit;
      const idsChunk = allIds.slice(startIdx, endIdx);

      return getTracksByIds(idsChunk);
    },
    initialPageParam: 0,
    getNextPageParam: (_, allPages) => {
      const allIds = playlist.tracks?.map((track) => track.id) ?? [];
      const totalChunks = Math.ceil(allIds.length / paginated_limit);

      return allPages.length < totalChunks ? allPages.length : undefined;
    },
  }));
</script>

<svelte:head>
  <title>{playlist.title}</title>
  <meta
    name="description"
    content={dedent`${playlist.user.username}
               ${playlist.track_count} tracks
               ${playlist.created_at}
           `}
  />

  <link rel="icon" href={playlist.artwork_url} />
  <meta name="og:image" content={playlist.artwork_url} />
</svelte:head>

<Main>
  {#snippet left()}
    <HeroSection
      pictureSrc={playlist.artwork_url}
      title={playlist.title}
      user={playlist.user}
    />
  {/snippet}

  {#snippet right()}
    <InfiniteQueryView
      {query}
      orderedIds={playlist.tracks?.map((track) => track.id)}
    />
  {/snippet}
</Main>
