<script lang="ts">
	import { global } from '$lib/global.svelte'
	import type { Track } from '$lib/schemas/track'
	import ListingThumbnail from '../ListingThumbnail.svelte'
	import Button from '../ui/Button.svelte'
	import { EllipsisIcon } from '@lucide/svelte'
	import { DropdownMenu } from 'bits-ui'
	import { toast } from 'svelte-sonner'

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
		class="flex items-center gap-4 truncate text-left transition-transform active:scale-95 active:opacity-50"
	>
		<ListingThumbnail
			src={track.artwork_url}
			alt="album cover of {track.title}"
		/>

		<div
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
		<DropdownMenu.Content align="start" class="flex flex-col gap-2">
			<Button href="/{track.user.permalink}/{track.permalink}">
				Go to Track
			</Button>

			<Button
				onclick={() => {
					global.queue.push(track)
					toast.success('Added to queue')
				}}
			>
				Play next
			</Button>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
