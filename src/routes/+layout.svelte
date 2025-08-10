<script lang='ts'>
  import type { Track } from '$lib/types'
  import { global } from '$lib/global.svelte'
  import { getTrackSource } from '$lib/srv/hsl.remote'
  import Hls from 'hls.js'
  import '../app.css'

  const { children } = $props()

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

<svelte:boundary>

  <div class='p-4 mb-96'>
    {@render children?.()}
  </div>

  <div class='fixed bottom-0 p-2 inset-x-0 bg-white border'>
    <div class='flex gap-2'>
      <img src={global.nowPlaying?.artwork_url} alt="" class='size-16'>
      <div>
        {global.nowPlaying?.title}
        <audio controls {@attach global.nowPlaying && applySource(global.nowPlaying)}></audio>
      </div>
    </div>

  </div>

  {#snippet pending()}
    loading
  {/snippet}
  {#snippet failed(error)}
    {error}
  {/snippet}
</svelte:boundary>
