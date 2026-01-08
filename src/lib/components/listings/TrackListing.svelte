<script lang="ts">
  import { favoriteTrackIds, global, nowPlaying } from "$lib/global.svelte";
  import type { Track } from "$lib/schemas/track";
  import GenericListing from "./GenericListing.svelte";
  import type { ClassValue } from "cnfn";
  import { haptic } from "ios-haptics";

  const {
    track,
    class: className,
  }: {
    track: Track;
    class?: ClassValue;
  } = $props();
</script>

<GenericListing
  class={className}
  title={track.title}
  subtitle={track.user.username}
  thumbnail={{
    src: track.artwork_url,
    alt: `Album cover of ${track.title}`,
  }}
  onclick={() => {
    nowPlaying.current = track;

    setTimeout(() => {
      global.isPaused = false;
    }, 50);
  }}
  badges={track.policy === "SNIP" ? ["30s only"] : []}
  actions={[
    {
      label: favoriteTrackIds.current.includes(track.id)
        ? "Unfavorite"
        : "Favorite",
      onclick: () => {
        if (favoriteTrackIds.current.includes(track.id)) {
          favoriteTrackIds.current = favoriteTrackIds.current.filter(
            (id) => id !== track.id,
          );
          haptic.confirm();
          return;
        } else {
          favoriteTrackIds.current.push(track.id);
          haptic.confirm();
        }
      },
    },
    {
      label: "Go to Track",
      href: `/${track.user.permalink}/${track.permalink}`,
    },
  ]}
/>
