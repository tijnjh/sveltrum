<script lang="ts">
	import { page } from '$app/state'
	import { global } from '$lib/global.svelte'
	import Button from './Button.svelte'
	import ListingThumbnail from './ListingThumbnail.svelte'
	import { PauseIcon, PlayIcon } from '@lucide/svelte'
	import { haptic } from 'ios-haptics'
	import { MediaQuery } from 'svelte/reactivity'

	let { children } = $props()

	const StatusIcon = $derived(global.isPaused ? PlayIcon : PauseIcon)

	const md = new MediaQuery('width > 768px')

	const navItems = [
		['/', 'Home'],
		['/search', 'Search'],
	] as const
</script>

{#if md.current}
	<!-- desktop -->
	<div class="grid grid-cols-[12rem_1fr]">
		<div
			class="sticky top-0 z-50 flex h-svh flex-col gap-2 border-r border-zinc-100/10 bg-zinc-700/50 p-4"
		>
			{#each navItems as [href, label] (href)}
				{@const isCurrent = page.url.pathname === `/${href.replace('/', '')}`}
				<Button {href} variant={isCurrent ? 'primary' : 'secondary'}>
					{label}
				</Button>
			{/each}
		</div>
		<div class="relative isolate">
			{@render children()}
			<div
				class="fixed right-0 bottom-0 left-[12rem] z-50 bg-zinc-700/75 backdrop-blur-lg"
			>
				{@render nowPlayingBar()}
			</div>
		</div>
	</div>
{:else}
	<!-- mobile -->
	{@render children()}

	<div class="fixed inset-x-0 bottom-0 z-50 bg-zinc-700/75 backdrop-blur-lg">
		{@render nowPlayingBar()}

		<nav class="flex items-center justify-center gap-2 p-4">
			{#each navItems as [href, label] (href)}
				{@const isCurrent = page.url.pathname === `/${href.replace('/', '')}`}
				<Button {href} variant={isCurrent ? 'primary' : 'secondary'}>
					{label}
				</Button>
			{/each}
		</nav>
	</div>
{/if}

{#snippet nowPlayingBar()}
	{#if global.nowPlaying}
		<div class="max-md:border-b max-md:border-zinc-100/10">
			<div
				class="mx-auto grid max-w-xl grid-cols-[1fr_auto] items-center gap-4 p-4"
			>
				<button
					onclick={() => (global.showNowPlayingView = true)}
					class="flex gap-4 truncate text-left"
				>
					<ListingThumbnail src={global.nowPlaying.artwork_url} alt="" />

					<div class="flex w-full min-w-0 flex-col">
						<h3 class="truncate">{global.nowPlaying.title}</h3>
						<p class="truncate opacity-50">{global.nowPlaying.user.username}</p>
					</div>
				</button>

				<Button
					size="icon"
					variant="secondary"
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
{/snippet}
