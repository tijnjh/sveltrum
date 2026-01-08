<script lang="ts">
  import { getRelatedTracks } from "$lib/api/discovery.remote";
  import { favoriteTrackIds, nowPlaying } from "$lib/global.svelte";
  import OmnipresentAudioTag from "./OmnipresentAudioTag.svelte";
  import Spinner from "./Spinner.svelte";
  import TrackListing from "./listings/TrackListing.svelte";
  import UserListing from "./listings/UserListing.svelte";
  import Button from "./ui/Button.svelte";
  import { createQuery } from "@tanstack/svelte-query";
  import { haptic } from "ios-haptics";

  const query = createQuery(() => ({
    queryKey: ["related", nowPlaying.current?.id],
    queryFn: async () => {
      if (!nowPlaying.current) return [];

      const relatedTracks = await getRelatedTracks(nowPlaying.current.id);

      return relatedTracks.collection;
    },
  }));
</script>

{#if nowPlaying.current?.artwork_url}
  <img
    src={nowPlaying.current.artwork_url.replace("large", "t500x500")}
    class="aspect-square w-full rounded-xl"
    alt=""
  />
{:else}
  <div class="aspect-square w-full rounded-xl bg-zinc-700 md:max-w-md"></div>
{/if}

{#if nowPlaying.current}
  <hgroup class="flex flex-col gap-4">
    <h1 class="text-2xl font-medium">
      {nowPlaying.current?.title}
    </h1>

    <Button
      class="w-fit"
      onclick={() => {
        if (!nowPlaying.current) return;

        if (favoriteTrackIds.current.includes(nowPlaying.current.id)) {
          favoriteTrackIds.current = favoriteTrackIds.current.filter(
            (id) => id !== nowPlaying.current?.id,
          );
          haptic.confirm();
          return;
        } else {
          favoriteTrackIds.current.push(nowPlaying.current.id);
          haptic.confirm();
        }
      }}
    >
      {favoriteTrackIds.current.includes(nowPlaying.current?.id)
        ? "Unfavorite"
        : "Favorite"}
    </Button>

    <UserListing user={nowPlaying.current.user} />

    {nowPlaying.current.label_name}
  </hgroup>

  <OmnipresentAudioTag />

  <div class="mt-8 flex flex-col gap-4">
    <h2 class="text-xl font-medium">Related Tracks</h2>

    {#if query.isLoading}
      <Spinner />
    {/if}
    {#if query.isError}
      <span class="text-xl font-medium text-zinc-100/25">
        Failed to load related tracks...
      </span>
    {:else if query.data?.length === 0}
      <span class="text-xl font-medium text-zinc-100/25">
        No related tracks found...
      </span>
    {:else if query.data}
      {#each query.data as track (track.id)}
        <TrackListing {track} />
      {/each}
    {/if}
  </div>
{/if}
