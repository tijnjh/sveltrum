<script lang='ts'>
  import type { Track } from '$lib/schemas/track'
  import { getTrackSource } from '$lib/api/hsl.remote'
  import { global } from '$lib/global.svelte'
  import { ChevronDownIcon } from '@lucide/svelte'
  import { cn } from 'cnfn'
  import Hls from 'hls.js'

  let { show = $bindable(), isPaused = $bindable() }: { show: boolean, isPaused: boolean } = $props()

  $effect(() => {
    if (global.nowPlaying) {
      isPaused = true

      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: global.nowPlaying.title,
          artist: global.nowPlaying.user.username,
          album: 'Sveltrum',
          artwork: [
            {
              src: global.nowPlaying.artwork_url ?? '',
              sizes: '500x500',
              type: 'image/jpeg',
            },
          ],
        })
      }
    }
  })

  const applySource = (track: Track) => (element: HTMLAudioElement) => {
    getTrackSource(track.id).then((url) => {
      if (!Hls.isSupported())
        throw new Error('hls is not supported')

      const hls = new Hls()
      hls.loadSource(url)
      hls.attachMedia(element)
    })
  }

  $effect(() => {
    if (global.nowPlaying) {
      isPaused = true

      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: global.nowPlaying.title,
          artist: global.nowPlaying.user.username,
          album: 'Sveltrum',
          artwork: [
            {
              src: global.nowPlaying.artwork_url ?? '',
              sizes: '500x500',
              type: 'image/jpeg',
            },
          ],
        })
      }
    }
  })
</script>

{#if global.nowPlaying}
  <div
    class={cn(
      'z-50 fixed inset-x-0 flex flex-col gap-4 bg-zinc-800 p-4 h-full transition-[top] duration-300',
      show ? 'top-0' : 'top-[100%]',
    )}
  >
    <button
      onclick={() => show = false}
      class='flex justify-center items-center bg-zinc-100/10 active:opacity-50 ml-auto rounded-full size-10 active:scale-90 transition-transform'
    >
      <ChevronDownIcon size={16} strokeWidth={3} />
    </button>

    {#if global.nowPlaying.artwork_url}
      <img src={global.nowPlaying.artwork_url.replace('large', 't500x500')} class='mt-12 aspect-square rounded-xl w-full md:max-w-md' alt="">
    {:else}
      <div class='mt-12 rounded-xl aspect-square bg-zinc-700 w-full md:max-w-md'></div>
    {/if}

    <h1 class='font-medium text-2xl'>{global.nowPlaying.title}</h1>

    <a href='/user/{global.nowPlaying.user.id}' class='text-white/50 text-xl' onclick={() => show = false}>
      {global.nowPlaying.user.username}
    </a>

    {#key global.nowPlaying}
      <audio
        bind:paused={isPaused}
        controls={show}
          {@attach global.nowPlaying && applySource(global.nowPlaying)}>
      </audio>
    {/key}
  </div>
{/if}
