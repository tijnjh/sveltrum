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
      'z-50 fixed inset-x-0 overflow-y-scroll place-items-center md:grid-cols-2 grid grid-cols-1 gap-x-8 bg-zinc-700/75 backdrop-blur-lg p-4 h-full transition-[top] duration-300',
      show ? 'top-0' : 'top-[100%]',
    )}
  >
    <button
      onclick={() => show = false}
      class='flex absolute justify-center items-center bg-zinc-100/10 active:opacity-50 top-4 right-4 rounded-full size-10 active:scale-90 transition-transform'
    >
      <ChevronDownIcon size={16} strokeWidth={3} />
    </button>

    <div class='flex flex-col max-md:mt-16 gap-4 w-full md:max-w-sm'>
      {#if track.artwork_url}
        <img src={track.artwork_url.replace('large', 't500x500')} class='mt-12 aspect-square rounded-xl w-full' alt="">
      {:else}
        <div class='mt-12 rounded-xl aspect-square bg-zinc-700 w-full md:max-w-md'></div>
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

    <div class='flex flex-col w-full gap-4 md:max-w-sm mb-16'>
      <h2 class='text-2xl mt-8 font-medium'>Related tracks</h2>

      {#await getRelatedTracks(track.id)}
        <Spinner />
      {:then relatedTracks}
        {#each relatedTracks.collection as track}
          <TrackListing {track} />
        {:else}
          <span class='text-xl font-medium text-zinc-100/25'>
            Nothing here...
          </span>
        {/each}
      {/await}
    </div>
  </div>
{/if}
