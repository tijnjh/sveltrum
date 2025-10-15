<script lang="ts">
	import TrackListing from '$lib/components/listings/TrackListing.svelte'
	import { getTrack } from './+layout.svelte'

	const track = getTrack()
</script>

<TrackListing {track} />
