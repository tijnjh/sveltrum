<script lang="ts">
	import { favoriteTrackIds, global, queue } from '$lib/global.svelte'
	import type { Track } from '$lib/schemas/track'
	import ListingThumbnail from '../ListingThumbnail.svelte'
	import Button from '../ui/Button.svelte'
	import { EllipsisIcon } from '@lucide/svelte'
	import { DropdownMenu } from 'bits-ui'
	import { toast } from 'svelte-sonner'
	import { scale } from 'svelte/transition'

	const {
		track,
		inAlbum = false,
	}: {
		track: Track
		inAlbum?: boolean
	} = $props()
</script>

<div class="group flex w-full justify-between gap-4">
	<button
		onclick={() => {
			global.nowPlaying = track

			setTimeout(() => {
				global.isPaused = false
			}, 50)
		}}
		class="flex cursor-pointer items-center gap-4 truncate text-left transition-transform active:scale-95 active:opacity-50"
	>
		<ListingThumbnail
			src={track.artwork_url}
			alt="album cover of {track.title}"
		/>

		<div class="flex w-full min-w-0 flex-col text-left">
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
		</div>
	</button>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<Button
				variant="secondary"
				icon={EllipsisIcon}
				aria-label="More options"
				size="icon"
			/>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="start" forceMount>
			{#snippet child({ props, open, wrapperProps })}
				<div {...wrapperProps}>
					{#if open}
						<div
							{...props}
							class="flex origin-top-left flex-col gap-2"
							transition:scale={{ start: 0.9, duration: 150 }}
						>
							<Button
								onclick={() => {
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
								}}
							>
								{favoriteTrackIds.current.includes(track.id)
									? 'Unfavorite'
									: 'Favorite'}
							</Button>

							<Button href="/{track.user.permalink}/{track.permalink}">
								Go to Track
							</Button>

							<Button
								onclick={() => {
									queue.current.push(track)
									toast.success('Added to queue')
								}}
							>
								Play next
							</Button>
						</div>
					{/if}
				</div>
			{/snippet}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
