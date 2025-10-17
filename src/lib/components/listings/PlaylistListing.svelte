<script module lang="ts">
	import type { Playlist } from '$lib/schemas/playlist'

	export interface PlaylistListingProps {
		playlist: Playlist
	}
</script>

<script lang="ts">
	import GenericListing from './GenericListing.svelte'

	const { playlist }: PlaylistListingProps = $props()
</script>

<GenericListing
	title={playlist.title}
	subtitle={playlist.user.username}
	thumbnail={{
		src: playlist.artwork_url,
		alt: `Playlist picture of ${playlist.title}`,
	}}
	href={`/${playlist.user.permalink}/sets/${playlist.permalink}`}
	badges={playlist.is_album ? ['Album'] : []}
/>
