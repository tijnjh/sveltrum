<script lang='ts'>
  import type { Track } from '$lib/types'
  import { page } from '$app/state'
  import { getTrackSource } from '$lib/srv/hsl.remote'
  import { getTrackById } from '$lib/srv/soundcloud.remote'
  import Hls from 'hls.js'

  const id = page.params.id!

  const applySource = (track: Track) => (element: HTMLAudioElement) => {
    getTrackSource(track.id).then((url) => {
      if (!Hls.isSupported())
        throw new Error('hls is not supported')

      const hls = new Hls()
      hls.loadSource(url)
      hls.attachMedia(element)
    })
  }

</script>

{#await getTrackById(id!)}
  loading...
{:then track}
  {#if track}
    {track.title}

    <img src={track.artwork_url} alt="" />

    <svelte:boundary>
      <audio controls {@attach applySource(track)}></audio>

      {#snippet failed(error)}
        {error}
      {/snippet}
    </svelte:boundary>
    {track}
  {/if}
{/await}
