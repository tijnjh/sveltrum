<script lang='ts'>
  import type { Track } from '$lib/types'
  import { page } from '$app/state'
  import { global } from '$lib/global.svelte'
  import { getTrackSource } from '$lib/srv/hsl.remote'
  import { PauseIcon, PlayIcon } from '@lucide/svelte'
  import { cn } from 'cnfn'
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

<svelte:boundary>

  <NuqsAdapter>

    <div class='mb-96'>
      {@render children?.()}
    </div>

    <div class='bottom-0 fixed inset-x-0 bg-zinc-700/75 backdrop-blur-lg'>
      {#if global.nowPlaying}
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
      {/if}

      <nav class='flex justify-center items-center gap-2 p-4'>
        {@render tab('/', 'home')}
        {@render tab('library')}
        {@render tab('search')}
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

{#snippet tab(href: string, label?: string)}
  {@const isCurrent = page.url.pathname === `/${href.replace('/', '')}`}
  <a
    {href}
    class={cn(
      'bg-zinc-700 px-4 rounded-full h-9 flex items-center justify-center',
      isCurrent && 'bg-white text-zinc-800',
    )}>
    {label ?? href}
  </a>
{/snippet}
