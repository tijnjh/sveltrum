<script lang="ts">
  import type { Playlist } from "$lib/schemas/playlist";
  import GenericListing from "./GenericListing.svelte";

  const { playlist }: { playlist: Playlist } = $props();
</script>

<GenericListing
  title={playlist.title}
  subtitle={playlist.user.username}
  thumbnail={{
    src: playlist.artwork_url,
    alt: `Playlist picture of ${playlist.title}`,
  }}
  href={`/${playlist.user.permalink}/sets/${playlist.permalink}`}
  badges={playlist.is_album ? ["Album"] : []}
/>
