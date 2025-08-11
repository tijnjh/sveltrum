<script lang='ts'>
  import type { Track } from '$lib/types'
  import { page } from '$app/state'
  import Button from '$lib/components/Button.svelte'
  import { global } from '$lib/global.svelte'
  import { getTrackSource } from '$lib/srv/hsl.remote'
  import { ChevronDown, HouseIcon, LibraryIcon, PauseIcon, PlayIcon, SearchIcon } from '@lucide/svelte'
  import { cn } from 'cnfn'
  import Hls from 'hls.js'
  import { NuqsAdapter } from 'nuqs-svelte/adapters/svelte-kit'
  import { slide } from 'svelte/transition'

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

  let showNowPlayingView = $state(false)

</script>

<svelte:boundary>

  <NuqsAdapter>

    <div class='mb-96'>
      {@render children?.()}
    </div>

    <div class='bottom-0 fixed inset-x-0 bg-zinc-700/75 backdrop-blur-lg'>
      {#if global.nowPlaying}
        <div class='p-4 border-zinc-100/10 border-b'>
          <div class='items-center gap-4 grid grid-cols-[1fr_auto]'>

            <button onclick={() => { showNowPlayingView = true }} class='flex text-left gap-4 truncate'>
              <img src={global.nowPlaying?.artwork_url} alt="" class='rounded-md size-12 aspect-square'>

              <div class='flex flex-col w-full min-w-0'>
                <h3 class='truncate'>{global.nowPlaying?.title}</h3>
                <p class='opacity-50 truncate'>{global.nowPlaying?.user.username}</p>
              </div>
            </button>

            <Button
              size='icon'
              variant='secondary'
              onclick={() => { isPaused = !isPaused }}
            >
              {#if isPaused}
                <PlayIcon fill='currentColor' class='opacity-50' size={16} />
              {:else}
                <PauseIcon fill='currentColor' class='opacity-50' size={16} />
              {/if}
            </Button>
          </div>
        </div>
      {/if}

      <nav class='flex justify-center items-center gap-2 p-4'>
        {#each [['/', 'Home', HouseIcon], ['/library', 'Library', LibraryIcon], ['/search', 'Search', SearchIcon]] as const as [href, label, Icon]}
          {@const isCurrent = page.url.pathname === `/${href.replace('/', '')}`}
          <Button {href} variant={isCurrent ? 'primary' : 'secondary'} class='gap-0'>
            <Icon size={16} strokeWidth={3} class={!isCurrent ? 'opacity-50' : ''} />
            {#if isCurrent}
              <span transition:slide={{ axis: 'x' }} class='ml-2'>{label}</span>
            {/if}
          </Button>
        {/each}
      </nav>
    </div>

    {#if global.nowPlaying}
      <div
        class={cn(
          'z-50 fixed inset-x-0 flex flex-col gap-4 bg-zinc-800 p-4 h-full transition-[top] duration-300',
          showNowPlayingView ? 'top-0' : 'top-[100%]',
        )}
      >
        <button
          onclick={() => { showNowPlayingView = false }}
          class='flex justify-center items-center bg-zinc-100/10 active:opacity-50 ml-auto rounded-full size-10 active:scale-90 transition-transform'
        >
          <ChevronDown size={16} strokeWidth={3} />
        </button>

        <img src={global.nowPlaying.artwork_url} class='mt-12 rounded-xl w-full md:max-w-md' alt="">

        <h1 class='font-medium text-2xl'>{global.nowPlaying.title}</h1>
        <h3 class='text-white/50 text-xl'>{global.nowPlaying.user.username}</h3>

        {#key global.nowPlaying}
          <audio
            bind:paused={isPaused}
            controls={showNowPlayingView}
          {@attach global.nowPlaying && applySource(global.nowPlaying)}>
          </audio>
        {/key}
      </div>
    {/if}
  </NuqsAdapter>

  {#snippet pending()}
    loading
  {/snippet}
  {#snippet failed(error)}
    {error}
  {/snippet}
</svelte:boundary>
