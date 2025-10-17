<script module lang="ts">
	import type { Track } from '$lib/schemas/track'

	export interface TrackListingProps {
		track: Track
		inAlbum?: boolean
	}
</script>

<script lang="ts">
	import { favoriteTrackIds, global, nowPlaying } from '$lib/global.svelte'
	import { queue } from '$lib/queue.svelte'
	import GenericListing from './GenericListing.svelte'
	import { toast } from 'svelte-sonner'

	const { track, inAlbum = false, ...props }: TrackListingProps = $props()
</script>

<GenericListing
	{...props}
	title={track.title}
	subtitle={inAlbum ? `${track.playback_count} plays` : track.user.username}
	thumbnail={{
		src: track.artwork_url,
		alt: `Album cover of ${track.title}`,
	}}
	onclick={() => {
		nowPlaying.current = track

		setTimeout(() => {
			global.isPaused = false
		}, 50)
	}}
	badges={track.policy === 'SNIP' ? ['30s only'] : []}
	actions={[
		{
			label: favoriteTrackIds.current.includes(track.id)
				? 'Unfavorite'
				: 'Favorite',
			onclick: () => {
				if (favoriteTrackIds.current.includes(track.id)) {
					favoriteTrackIds.current = favoriteTrackIds.current.filter(
						(id) => id !== track.id,
					)
					toast.success('Removed from favorites')
					return
				} else {
					favoriteTrackIds.current.push(track.id)
					toast.success('Added to favorites')
				}
			},
		},
		{
			label: 'Go to Track',
			href: `/${track.user.permalink}/${track.permalink}`,
		},
		{
			label: 'Add to queue',
			onclick: () => {
				queue.add(track)
				toast.success('Added to queue')
			},
		},
	]}
/>
