<script lang="ts">
	import { page } from '$app/state'
	import NowPlayingBar from '$lib/components/NowPlayingBar.svelte'
	import NowPlayingView from '$lib/components/NowPlayingView.svelte'
	import Button from '$lib/components/ui/Button.svelte'
	import { global } from '$lib/global.svelte'
	import '../app.css'
	import { ChevronLeft } from '@lucide/svelte'
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
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
	{#if page.route.id !== '/'}
		<div
			class="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-5xl justify-between bg-gradient-to-b from-zinc-800 to-zinc-700/0 p-4"
		>
			<Button
				variant="secondary"
				icon={ChevronLeft}
				onclick={() => history.back()}>Back</Button
			>

			<Button variant="secondary" href="/">Home</Button>
		</div>
	{/if}

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

<Toaster
	richColors
	theme="dark"
	position="bottom-center"
	offset={{ bottom: tweenedToasterBottomOffset.current }}
	mobileOffset={{ bottom: tweenedToasterBottomOffset.current }}
/>
