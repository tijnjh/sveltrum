<script lang='ts'>
  import BottomNav from '$lib/components/BottomNav.svelte'
  import NowPlayingView from '$lib/components/NowPlayingView.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import '../app.css'

  const { children } = $props()

  let isPaused = $state(true)
  let showNowPlayingView = $state(false)
</script>

<svelte:boundary>
  <div class='mb-64'>
    {@render children()}
  </div>

  <BottomNav bind:show={showNowPlayingView} bind:isPaused />
  <NowPlayingView bind:show={showNowPlayingView} bind:isPaused />

  {#snippet pending()}
    <Spinner />
  {/snippet}
  {#snippet failed(error)}
    {error}
  {/snippet}
</svelte:boundary>
