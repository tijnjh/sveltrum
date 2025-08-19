<script lang='ts'>
  import type { Track } from '$lib/schemas/track'
  import { getRelatedTracks } from '$lib/api/discovery.remote'
  import { getTrackSource } from '$lib/api/hsl.remote'
  import { global } from '$lib/global.svelte'
  import { ChevronDownIcon } from '@lucide/svelte'
  import { cn } from 'cnfn'
  import { err } from 'dethrow'
  import Hls from 'hls.js'
  import TrackListing from './listings/TrackListing.svelte'
  import SafeRender from './SafeRender.svelte'
  import Spinner from './Spinner.svelte'

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

  const applySource = (track: Track) => (element: HTMLAudioElement) => void getTrackSource(track.id).then((url) => {
    if (url.isErr())
      return err(url.err)

    if (!Hls.isSupported())
      return err('hls is not supported')

    const hls = new Hls()
    hls.loadSource(url.val)
    hls.attachMedia(element)
  })

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

        <a href='/user/{track.user.id}' class='text-white/50 text-xl' onclick={() => show = false}>
          {track.user.username}
        </a>
      </hgroup>

      {#key track}
        <audio
          class='h-10'
          bind:paused={isPaused}
          controls
          {@attach track && applySource(track)}>
        </audio>
      {/key}
    </div>

    <div class='flex flex-col w-full gap-4 md:max-w-sm'>
      <h2 class='text-2xl mt-8 font-medium'>Related tracks</h2>

      {#await getRelatedTracks(track.id)}
        <Spinner />
      {:then res}
        <SafeRender {res}>
          {#snippet ok(relatedTracks)}
            {#each relatedTracks.val.collection as track}
              <TrackListing {track} />
            {/each}
          {/snippet}
        </SafeRender>
      {/await}
    </div>
  </div>
{/if}
