<script lang='ts'>
  import type { Track } from '$lib/schemas/track'
  import { onNavigate } from '$app/navigation'
  import { getRelatedTracks } from '$lib/api/discovery.remote'
  import { getTrackSource } from '$lib/api/hsl.remote'
  import { global } from '$lib/global.svelte'
  import { ChevronDownIcon } from '@lucide/svelte'
  import { cn } from 'cnfn'
  import Hls from 'hls.js'
  import TrackListing from './listings/TrackListing.svelte'
  import UserListing from './listings/UserListing.svelte'
  import Spinner from './Spinner.svelte'

  let { show = $bindable() }: { show: boolean } = $props()

  $effect(() => {
    if (global.nowPlaying) {
      global.isPaused = true

      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: global.nowPlaying.title,
          artist: global.nowPlaying.user.username,
          album: 'Sveltrum',
          artwork: [
            {
              src: global.nowPlaying.artwork_url?.replace('large', 't500x500') ?? '',
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
      if (!Hls.isSupported()) {
        throw new Error('hls is not supported')
      }

      const hls = new Hls()
      hls.loadSource(url)
      hls.attachMedia(element)
    })
  }

  onNavigate(() => {
    show = false
  })
</script>

<svelte:window onkeydown={(e) => {
  if (e.key === 'Escape') {
    e.preventDefault()
    show = false
  }
}} />

{#if global.nowPlaying}
  {@const track = global.nowPlaying}

  <div
    class={cn(
      'z-50 fixed inset-x-0 place-items-center gap-x-8 grid grid-cols-1 md:grid-cols-2 bg-zinc-700/75 backdrop-blur-lg p-4 h-full overflow-y-scroll transition-[top] duration-300',
      show ? 'top-0' : 'top-[100%]',
    )}
  >
    <button
      onclick={() => show = false}
      class='top-4 right-4 absolute flex justify-center items-center bg-zinc-100/10 active:opacity-50 rounded-full size-10 active:scale-90 transition-transform'
    >
      <ChevronDownIcon size={16} strokeWidth={3} />
    </button>

    <div class='flex flex-col gap-4 max-md:mt-16 w-full md:max-w-sm'>
      {#if track.artwork_url}
        <img src={track.artwork_url.replace('large', 't500x500')} class='mt-12 rounded-xl w-full aspect-square' alt="">
      {:else}
        <div class='bg-zinc-700 mt-12 rounded-xl w-full md:max-w-md aspect-square'></div>
      {/if}

      <hgroup>
        <h1 class='font-medium text-2xl'>{track.title}</h1>
        <UserListing user={track.user} class='mt-4' />
      </hgroup>

      {#key track}
        <audio
          class='h-10'
          bind:paused={global.isPaused}
          controls
          {@attach track && applySource(track)}>
        </audio>
      {/key}
    </div>

    <div class='flex flex-col gap-4 mb-16 w-full md:max-w-sm'>
      <h2 class='mt-8 font-medium text-2xl'>Related tracks</h2>

      {#await getRelatedTracks(track.id)}
        <Spinner />
      {:then relatedTracks}
        {#each relatedTracks.collection as track}
          <TrackListing {track} />
        {:else}
          <span class='font-medium text-zinc-100/25 text-xl'>
            Nothing here...
          </span>
        {/each}
      {/await}
    </div>
  </div>
{/if}
