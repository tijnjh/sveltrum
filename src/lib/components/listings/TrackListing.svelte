<script module lang="ts">
	import type { Track } from '$lib/schemas/track'

	export interface TrackListingProps {
		track: Track
		inAlbum?: boolean
	}
</script>

<script lang="ts">
	import { global } from '$lib/global.svelte'
	import ListingThumbnail from '../ListingThumbnail.svelte'
	import { PlayIcon } from '@lucide/svelte'

	const { track, inAlbum = false }: TrackListingProps = $props()
</script>

<div class="grid grid-cols-[auto_1fr] items-center gap-4">
	<button
		onclick={() => {
			global.nowPlaying = track

			setTimeout(() => {
				global.isPaused = false
			}, 50)
		}}
		class="group relative cursor-pointer overflow-clip rounded transition-transform active:scale-90 active:opacity-50"
	>
		<ListingThumbnail
			src={track.artwork_url}
			alt="album cover of {track.title}"
			class="transition-[filter,scale] group-hover:scale-120 group-hover:blur-xs "
		/>

		<div
			class="absolute inset-0 grid scale-90 touch-none place-items-center bg-zinc-800/50 text-white opacity-0 transition-[opacity,scale] group-hover:scale-100 group-hover:opacity-100"
		>
			<PlayIcon fill="currentColor" />
		</div>
	</button>

	<a
		href="/{track.user.permalink}/{track.permalink}"
		class="flex w-full min-w-0 cursor-pointer flex-col text-left transition-transform active:scale-95 active:opacity-50"
	>
		<div class="flex gap-2">
			<h3 class="truncate">{track.title}</h3>

			{#if track.policy === 'SNIP'}
				<div
					class="rounded-full bg-zinc-700 px-2 py-0.5 text-sm whitespace-nowrap text-zinc-400"
				>
					30s only
				</div>
			{/if}
		</div>
		<p class="truncate opacity-50">
			{#if inAlbum}
				{track.playback_count?.toLocaleString()} plays
			{:else}
				{track.user?.username}
			{/if}
		</p>
	</a>
</div>
