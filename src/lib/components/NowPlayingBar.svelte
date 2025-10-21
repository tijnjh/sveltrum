<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { global, nowPlaying } from '$lib/global.svelte'
	import ListingThumbnail from './ListingThumbnail.svelte'
	import { PauseIcon, PlayIcon } from '@lucide/svelte'
	import { haptic } from 'ios-haptics'
	import { fly } from 'svelte/transition'

	const StatusIcon = $derived(global.isPaused ? PlayIcon : PauseIcon)
</script>

{#if !global.showNowPlayingView}
	<div
		transition:fly={{ y: 100 }}
		class="fixed inset-x-2 bottom-2 z-9999999999 mx-auto rounded-2xl bg-zinc-700/75 backdrop-blur-lg md:inset-x-4 md:bottom-4 md:max-w-xl"
	>
		<div class="grid grid-cols-[1fr_auto] items-center gap-4 p-3">
			<button
				onclick={() => (global.showNowPlayingView = true)}
				class="flex gap-4 truncate text-left"
			>
				<ListingThumbnail src={nowPlaying.current?.artwork_url} alt="" />

				<div class="flex w-full min-w-0 flex-col">
					<h3 class="truncate">{nowPlaying.current?.title}</h3>
					<p class="truncate opacity-50">{nowPlaying.current?.user.username}</p>
				</div>
			</button>

			<Button
				size="icon"
				onclick={() => {
					haptic()
					global.isPaused = !global.isPaused
				}}
			>
				<StatusIcon fill="currentColor" class="opacity-50" size={16} />
			</Button>
		</div>
	</div>
{/if}
