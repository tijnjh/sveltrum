<script lang="ts">
	import TrackListing from '$lib/components/listings/TrackListing.svelte'

	const { data: track } = $props()
</script>

<TrackListing {track} />
