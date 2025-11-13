<script lang="ts">
  import TrackListing from "$lib/components/listings/TrackListing.svelte";
  import dedent from "dedent";

  const { data: track } = $props();
</script>

<svelte:head>
  <title>{track.title}</title>
  <meta
    name="description"
    content={dedent`${track.user.username}
            ${track.label_name}
            ${track.genre} - ${track.release_date}
        `}
  />

  <link rel="icon" href={track.artwork_url} />
  <meta name="og:image" content={track.artwork_url} />
</svelte:head>

<TrackListing {track} />
