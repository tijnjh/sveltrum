<script lang="ts">
  import { page } from "$app/state";
  import { getThemeFromImageUrl } from "$lib/api/palette.remote";
  import { resolvePlaylist } from "$lib/api/playlist.remote";
  import { getTracksByIds } from "$lib/api/track.remote";
  import AsyncView from "$lib/components/AsyncView.svelte";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import { paginated_limit } from "$lib/constants";
  import { theme } from "$lib/theme.svelte";
  import { createInfiniteQuery, createQuery } from "@tanstack/svelte-query";
  import dedent from "dedent";
  import { watch } from "runed";

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
    enabled: !!playlistQuery.data?.id,
  }));

  const paletteQuery = createQuery(() => ({
    queryKey: ["palette", playlistQuery.data?.artwork_url],
    queryFn: () => {
      if (!playlistQuery.data?.artwork_url) return;
      return getThemeFromImageUrl(playlistQuery.data.artwork_url);
    },
    enabled: !!playlistQuery.data?.artwork_url && !!playlistQuery.data.is_album,
  }));

  watch(
    () => paletteQuery.data,
    (palette) => {
      theme.themeVariables = {
        vibrant: palette?.vibrant,
        darkVibrant: palette?.darkVibrant,
        lightVibrant: palette?.lightVibrant,
        muted: palette?.muted,
        darkMuted: palette?.darkMuted,
        lightMuted: palette?.lightMuted,
      };
    },
  );
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
    <AsyncView data={playlistQuery.data} isLoading={playlistQuery.isPending}>
      {#snippet content(playlist)}
        <HeroSection
          pictureSrc={playlist!.artwork_url}
          title={playlist!.title}
          user={playlist!.user}
        />
      {/snippet}
    </AsyncView>
  {/snippet}

  {#snippet right()}
    <InfiniteQueryView
      {query}
      orderedIds={playlistQuery.data?.tracks?.map((track) => track.id)}
    />
  {/snippet}
</Main>
