<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte'
	import NowPlayingView from '$lib/components/NowPlayingView.svelte'
	import Spinner from '$lib/components/Spinner.svelte'
	import '../app.css'

	const { children } = $props()

	let showNowPlayingView = $state(false)
</script>

<svelte:boundary>
	<Navigation bind:show={showNowPlayingView}>
		<div class="mb-64">
			{@render children()}
		</div>
	</Navigation>
	<NowPlayingView bind:show={showNowPlayingView} />

	{#snippet pending()}
		<Spinner />
	{/snippet}
	{#snippet failed(error)}
		{error}
	{/snippet}
</svelte:boundary>
