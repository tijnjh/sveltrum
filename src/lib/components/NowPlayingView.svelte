<script lang="ts">
	import { onNavigate } from '$app/navigation'
	import { getRelatedTracks } from '$lib/api/discovery.remote'
	import { getTrackSource } from '$lib/api/hls.remote'
	import { favoriteTrackIds, global, nowPlaying } from '$lib/global.svelte'
	import { queue } from '$lib/queue.svelte'
	import type { Track } from '$lib/schemas/track'
	import Spinner from './Spinner.svelte'
	import TrackListing from './listings/TrackListing.svelte'
	import UserListing from './listings/UserListing.svelte'
	import Button from './ui/Button.svelte'
	import { ChevronDownIcon } from '@lucide/svelte'
	import { createQuery } from '@tanstack/svelte-query'
	import { cn } from 'cnfn'
	// @ts-expect-error they dont have types (yet)
	import Hls from 'hls.js/light'
	import { haptic } from 'ios-haptics'
	import { toast } from 'svelte-sonner'

	$effect(() => {
		if (nowPlaying.current) {
			global.isPaused = true

			if ('mediaSession' in navigator) {
				navigator.mediaSession.metadata = new MediaMetadata({
					title: nowPlaying.current.title,
					artist: nowPlaying.current.user.username,
					album: 'Sveltrum',
					artwork: [
						{
							src:
								nowPlaying.current.artwork_url?.replace('large', 't500x500') ??
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
		global.showNowPlayingView = false
	})

	const query = createQuery(() => ({
		queryKey: ['related', nowPlaying.current?.id],
		queryFn: async () => {
			if (!nowPlaying.current) return []

			const relatedTracks = await getRelatedTracks(nowPlaying.current.id)

			return relatedTracks.collection
		},
	}))

	let currentView = $state<'related' | 'queue'>('related')
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			e.preventDefault()
			global.showNowPlayingView = false
		}
	}}
/>

<div
	class={cn(
		'fixed inset-x-0 z-50 grid h-full grid-cols-1 place-items-center gap-x-8 overflow-y-scroll bg-zinc-700/75 p-4 backdrop-blur-lg transition-[top] duration-300 md:grid-cols-2',
		global.showNowPlayingView ? 'top-0' : 'top-[100%]',
	)}
>
	<button
		onclick={() => (global.showNowPlayingView = false)}
		class="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-zinc-100/10 transition-transform active:scale-90 active:opacity-50"
	>
		<ChevronDownIcon size={16} strokeWidth={3} />
	</button>

	<div class="flex w-full flex-col gap-4 max-md:mt-16 md:max-w-sm">
		{#if nowPlaying.current?.artwork_url}
			<img
				src={nowPlaying.current.artwork_url.replace('large', 't500x500')}
				class="mt-12 aspect-square w-full rounded-xl"
				alt=""
			/>
		{:else}
			<div
				class="mt-12 aspect-square w-full rounded-xl bg-zinc-700 md:max-w-md"
			></div>
		{/if}

		{#if nowPlaying.current}
			<hgroup class="flex flex-col gap-4">
				<h1 class="text-2xl font-medium">
					{nowPlaying.current?.title}
				</h1>

				<Button
					class="w-fit"
					onclick={() => {
						if (!nowPlaying.current) return

						if (favoriteTrackIds.current.includes(nowPlaying.current.id)) {
							favoriteTrackIds.current = favoriteTrackIds.current.filter(
								(id) => id !== nowPlaying.current?.id,
							)
							toast.success('Removed from favorites')
							haptic.confirm()
							return
						} else {
							favoriteTrackIds.current.push(nowPlaying.current.id)
							toast.success('Added to favorites')
							haptic.confirm()
						}
					}}
				>
					{favoriteTrackIds.current.includes(nowPlaying.current?.id)
						? 'Unfavorite'
						: 'Favorite'}
				</Button>

				<UserListing user={nowPlaying.current.user} />
			</hgroup>
		{/if}

		{#key nowPlaying.current}
			<audio
				class="h-10"
				bind:paused={global.isPaused}
				controls
				{@attach nowPlaying.current && applySource(nowPlaying.current)}
				onended={() => queue.next()}
			>
			</audio>
		{/key}

		<div class="flex flex-wrap gap-2">
			<Button
				disabled={queue.tracks.current.length === 0}
				class="w-fit"
				onclick={() => queue.next()}
			>
				Next track
			</Button>
		</div>
	</div>

	<div class="mt-8 flex w-full flex-col gap-4 md:h-dvh md:max-w-sm">
		<div class="mx-auto flex w-full max-w-xl gap-2">
			{#each ['related', 'queue'] as const as view (view)}
				{#key currentView}
					<Button
						variant={currentView === view ? 'primary' : 'secondary'}
						class="capitalize"
						onclick={() => {
							currentView = view
							query.refetch()
						}}
					>
						{view}
					</Button>
				{/key}
			{/each}
		</div>

		{#if currentView === 'queue'}
			<!-- eslint-disable-next-line svelte/require-each-key -->
			{#each queue.tracks.current as track}
				<TrackListing {track} />
			{:else}
				<span class="text-xl font-medium text-zinc-100/25">
					Your queue is empty...
				</span>
			{/each}

			{#if queue.tracks.current.length > 0}
				<Button
					variant="secondary"
					class="mt-4 w-full"
					onclick={() => {
						queue.clear()
						haptic.confirm()
					}}
				>
					Clear Queue
				</Button>
			{/if}
		{:else if currentView === 'related'}
			{#if query.isLoading}
				<Spinner />
			{/if}
			{#if query.isError}
				<span class="text-xl font-medium text-zinc-100/25">
					Failed to load related tracks...
				</span>
			{:else if query.data?.length === 0}
				<span class="text-xl font-medium text-zinc-100/25">
					No related tracks found...
				</span>
			{:else if query.data}
				{#each query.data as track (track.id)}
					<TrackListing {track} />
				{/each}
			{/if}
		{/if}
	</div>
</div>
