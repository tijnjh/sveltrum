<script lang="ts">
	import { goto } from '$app/navigation'
	import { favoriteTrackIds, global, nowPlaying } from '$lib/global.svelte'
	import { queue } from '$lib/queue.svelte'
	import type { Track } from '$lib/schemas/track'
	import GenericListing from './GenericListing.svelte'
	import { haptic } from 'ios-haptics'
	import { toast } from 'svelte-sonner'

	const { track }: { track: Track } = $props()
</script>

<GenericListing
	title={track.title}
	subtitle={track.user.username}
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
					haptic.confirm()
					return
				} else {
					favoriteTrackIds.current.push(track.id)
					toast.success('Added to favorites')
					haptic.confirm()
				}
			},
		},
		{
			label: 'Go to Track',
			onclick: () => goto(`/${track.user.permalink}/${track.permalink}`),
		},
		{
			label: 'Add to queue',
			onclick: () => {
				queue.add(track)
				toast.success('Added to queue')
				haptic.confirm()
			},
		},
	]}
/>
