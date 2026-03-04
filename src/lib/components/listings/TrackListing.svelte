<script lang="ts">
  import { favorites, global, nowPlaying } from "$lib/global.svelte";
  import type { Track } from "$lib/schemas/track";
  import type { GenericListingProps } from "./GenericListing.svelte";
  import GenericListing from "./GenericListing.svelte";
  import { haptic } from "ios-haptics";

  const { track }: { track: Track } = $props();

  type Action = NonNullable<GenericListingProps["actions"]>[number];

  const actions = $derived.by((): Action[] => {
    const items: Action[] = [];

    if (favorites.isSignedIn) {
      items.push({
        label: favorites.current.includes(track.id) ? "Unfavorite" : "Favorite",
        onclick: () => {
          favorites.toggle(track.id);
          haptic.confirm();
        },
      });
    }

    items.push({
      label: "Go to Track",
      href: `/${track.user.permalink}/${track.permalink}`,
    });

    return items;
  });
</script>

<GenericListing
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
  {actions}
/>
