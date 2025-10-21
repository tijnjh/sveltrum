<script lang="ts">
	import { page } from '$app/state'
	import NowPlayingBar from '$lib/components/NowPlayingBar.svelte'
	import NowPlayingView from '$lib/components/NowPlayingView.svelte'
	import { Button } from '$lib/components/ui/button'
	import { global } from '$lib/global.svelte'
	import '../app.css'
	import { ChevronLeft } from '@lucide/svelte'
	import MoonIcon from '@lucide/svelte/icons/moon'
	import SunIcon from '@lucide/svelte/icons/sun'
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
	import { ModeWatcher } from 'mode-watcher'
	import { toggleMode } from 'mode-watcher'
	import { toast, Toaster } from 'svelte-sonner'
	import { Tween } from 'svelte/motion'

	const { children } = $props()

	const queryClient = new QueryClient()

	const tweenedToasterBottomOffset = new Tween(0, {
		duration: 200,
	})

	$effect(() => {
		if (!global.showNowPlayingView) {
			tweenedToasterBottomOffset.set(100)
		} else {
			tweenedToasterBottomOffset.set(16)
		}
	})
</script>

<QueryClientProvider client={queryClient}>
	<div
		class="from-background fixed inset-x-0 top-0 z-40 mx-auto flex max-w-5xl justify-between bg-linear-to-b to-zinc-700/0 p-4"
	>
		{#if page.route.id !== '/'}
			<Button onclick={() => history.back()}>
				<ChevronLeft />
				Back
			</Button>
		{:else}
			<div></div>
		{/if}

		<div class="flex gap-4">
			{#if page.route.id !== '/'}
				<Button href="/">Home</Button>
			{/if}

			<Button onclick={toggleMode} size="icon">
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</div>

	<NowPlayingView />
	<NowPlayingBar />

	<svelte:boundary
		onerror={(error, reset) =>
			toast.error('An error occurred', {
				description: `${error}`,
				action: {
					label: 'Retry',
					onClick: reset,
				},
			})}
	>
		{@render children()}
	</svelte:boundary>
</QueryClientProvider>

<ModeWatcher />
<Toaster
	richColors
	position="bottom-center"
	offset={{ bottom: tweenedToasterBottomOffset.current }}
	mobileOffset={{ bottom: tweenedToasterBottomOffset.current }}
/>
