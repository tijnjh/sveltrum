<script lang="ts">
  import { page } from "$app/state";
  import { resolveTrack } from "$lib/api/track.remote";
  import AsyncView from "$lib/components/AsyncView.svelte";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import Main from "$lib/components/Main.svelte";
  import TrackListing from "$lib/components/listings/TrackListing.svelte";
  import { createQuery } from "@tanstack/svelte-query";
  import dedent from "dedent";

  const trackQuery = createQuery(() => ({
    queryKey: ["track", page.params.track],
    queryFn: () =>
      resolveTrack({
        track: page.params.track!,
        user: page.params.user!,
      }),
  }));
</script>

<svelte:head>
  <title>{trackQuery.data?.title}</title>
  <meta
    name="description"
    content={dedent`${trackQuery.data?.user.username}
            ${trackQuery.data?.label_name}
            ${trackQuery.data?.genre} - ${trackQuery.data?.release_date}
        `}
  />

  <link rel="icon" href={trackQuery.data?.artwork_url} />
  <meta name="og:image" content={trackQuery.data?.artwork_url} />
</svelte:head>

<Main>
  {#snippet left()}
    <AsyncView data={trackQuery.data} isLoading={trackQuery.isPending}>
      {#snippet content(track)}
        <HeroSection
          pictureSrc={track!.artwork_url}
          title={track!.title}
          user={track!.user}
        />
      {/snippet}
    </AsyncView>
  {/snippet}

  {#snippet right()}
    <AsyncView data={trackQuery.data} isLoading={trackQuery.isPending}>
      {#snippet content(track)}
        <TrackListing track={track!} />
      {/snippet}
    </AsyncView>
  {/snippet}
</Main>
