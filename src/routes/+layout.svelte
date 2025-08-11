<script lang='ts'>
  import type { Track } from '$lib/types'
  import { global } from '$lib/global.svelte'
  import { getTrackSource } from '$lib/srv/hsl.remote'
  import { PauseIcon, PlayIcon } from '@lucide/svelte'
  import Hls from 'hls.js'
  import { NuqsAdapter } from 'nuqs-svelte/adapters/svelte-kit'
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

  let audioEl: HTMLAudioElement | null = $state(null)
  let isPaused = $state(true)

  $effect(() => {
    if (global.nowPlaying) {
      isPaused = true
    }
  })

</script>

<svelte:boundary>

  <NuqsAdapter>

    <div class='mb-96'>
      {@render children?.()}
    </div>

    <div class='bottom-0 fixed inset-x-0 bg-zinc-700/75 backdrop-blur-lg'>
      <div class='p-4 border-b border-zinc-100/10'>

        <div class='items-center gap-4 grid grid-cols-[auto_1fr_auto]'>
          <img src={global.nowPlaying?.artwork_url} alt="" class=' rounded-md size-12 aspect-square'>
          <div class='flex flex-col w-full min-w-0'>
            <h3 class='truncate'>{global.nowPlaying?.title}</h3>
            <p class='truncate opacity-50'>{global.nowPlaying?.user.username}</p>
          </div>

          {#if audioEl}
            <button
              class='flex justify-center items-center active:opacity-50 bg-zinc-100/10 rounded-full size-10 active:scale-90 transition-transform'
              onclick={() => {
                if (!audioEl) {
                  return
                }

                if (audioEl.paused) {
                  audioEl?.play()
                  isPaused = false
                }
                else {
                  audioEl?.pause()
                  isPaused = true
                }
              }}
            >
              {#if isPaused}
                <PlayIcon fill='currentColor' class='opacity-59' size={16} />
              {:else}
                <PauseIcon fill='currentColor' class='opacity-59' size={16} />
              {/if}
            </button>
          {/if}
        </div>

      </div>

      <nav class='flex justify-center items-center gap-2 p-4'>
        <a href='library'>library</a>
        <a href='search'>search</a>
      </nav>
    </div>

    {#key global.nowPlaying}
      <audio
        bind:this={audioEl}
        class='max-md:w-12'
      {@attach global.nowPlaying && applySource(global.nowPlaying)}>
      </audio>
    {/key}

  </NuqsAdapter>

  {#snippet pending()}
    loading
  {/snippet}
  {#snippet failed(error)}
    {error}
  {/snippet}
</svelte:boundary>
