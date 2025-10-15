<script lang="ts">
	import { page } from '$app/state'
	import NowPlayingBar from '$lib/components/NowPlayingBar.svelte'
	import NowPlayingView from '$lib/components/NowPlayingView.svelte'
	import Spinner from '$lib/components/Spinner.svelte'
	import Button from '$lib/components/ui/Button.svelte'
	import '../app.css'
	import { ChevronLeft } from '@lucide/svelte'
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
	import { Toaster } from 'svelte-sonner'

	const { children } = $props()

	const queryClient = new QueryClient()
</script>

<QueryClientProvider client={queryClient}>
	{#if page.route.id !== '/'}
		<div
			class="sticky top-0 z-40 mx-auto flex max-w-4xl justify-between bg-gradient-to-b from-zinc-800 to-zinc-700/0 p-4"
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

	<svelte:boundary>
		{@render children()}

		{#snippet pending()}
			<Spinner />
		{/snippet}
		{#snippet failed(error)}
			{error}
		{/snippet}
	</svelte:boundary>
</QueryClientProvider>

<Toaster richColors />
