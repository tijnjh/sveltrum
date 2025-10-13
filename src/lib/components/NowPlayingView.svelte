<script lang="ts">
	import { onNavigate } from '$app/navigation'
	import { getRelatedTracks } from '$lib/api/discovery.remote'
	import { getTrackSource } from '$lib/api/hls.remote'
	import { global } from '$lib/global.svelte'
	import type { Track } from '$lib/schemas/track'
	import Spinner from './Spinner.svelte'
	import TrackListing from './listings/TrackListing.svelte'
	import UserListing from './listings/UserListing.svelte'
	import { ChevronDownIcon } from '@lucide/svelte'
	import { cn } from 'cnfn'
	import Hls from 'hls.js'

	let { show = $bindable() }: { show: boolean } = $props()

	$effect(() => {
		if (global.nowPlaying) {
			global.isPaused = true

			if ('mediaSession' in navigator) {
				navigator.mediaSession.metadata = new MediaMetadata({
					title: global.nowPlaying.title,
					artist: global.nowPlaying.user.username,
					album: 'Sveltrum',
					artwork: [
						{
							src:
								global.nowPlaying.artwork_url?.replace('large', 't500x500') ??
								'',
							sizes: '500x500',
							type: 'image/jpeg',
						},
					],
				})
			}
		}
	})

	const applySource = (track: Track) => (element: HTMLAudioElement) =>
		void getTrackSource(track.id).then((url) => {
			if (!Hls.isSupported()) {
				throw new Error('hls is not supported')
			}

			const hls = new Hls()
			hls.loadSource(url)
			hls.attachMedia(element)
		})

	onNavigate(() => {
		show = false
	})
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			e.preventDefault()
			show = false
		}
	}}
/>

{#if global.nowPlaying}
	{@const track = global.nowPlaying}

	<div
		class={cn(
			'fixed inset-x-0 z-50 grid h-full grid-cols-1 place-items-center gap-x-8 overflow-y-scroll bg-zinc-700/75 p-4 backdrop-blur-lg transition-[top] duration-300 md:grid-cols-2',
			show ? 'top-0' : 'top-[100%]',
		)}
	>
		<button
			onclick={() => (show = false)}
			class="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-zinc-100/10 transition-transform active:scale-90 active:opacity-50"
		>
			<ChevronDownIcon size={16} strokeWidth={3} />
		</button>

		<div class="flex w-full flex-col gap-4 max-md:mt-16 md:max-w-sm">
			{#if track.artwork_url}
				<img
					src={track.artwork_url.replace('large', 't500x500')}
					class="mt-12 aspect-square w-full rounded-xl"
					alt=""
				/>
			{:else}
				<div
					class="mt-12 aspect-square w-full rounded-xl bg-zinc-700 md:max-w-md"
				></div>
			{/if}

			<hgroup>
				<h1 class="text-2xl font-medium">{track.title}</h1>
				<UserListing user={track.user} class="mt-4" />
			</hgroup>

			{#key track}
				<audio
					class="h-10"
					bind:paused={global.isPaused}
					controls
					{@attach track && applySource(track)}
				>
				</audio>
			{/key}
		</div>

		<div class="mb-16 flex w-full flex-col gap-4 md:max-w-sm">
			<h2 class="mt-8 text-2xl font-medium">Related tracks</h2>

			{#await getRelatedTracks(track.id)}
				<Spinner />
			{:then relatedTracks}
				{#each relatedTracks.collection as track (track.id)}
					<TrackListing {track} />
				{:else}
					<span class="font-medium text-zinc-100/25 text-xl">
						Nothing here...
					</span>
				{/each}
			{/await}
		</div>
	</div>
{/if}
