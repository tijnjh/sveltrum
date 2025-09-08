<script module lang='ts'>
  import type { Snippet } from 'svelte'

  export interface NavigationProps {
    show: boolean
    children: Snippet
  }
</script>

<script lang='ts'>
  import { page } from '$app/state'
  import { global } from '$lib/global.svelte'
  import { PauseIcon, PlayIcon } from '@lucide/svelte'
  import { haptic } from 'ios-haptics'
  import { MediaQuery } from 'svelte/reactivity'
  import Button from './Button.svelte'
  import ListingThumbnail from './ListingThumbnail.svelte'

  let { show = $bindable(), children }: NavigationProps = $props()

  const StatusIcon = $derived(global.isPaused ? PlayIcon : PauseIcon)

  const md = new MediaQuery('width > 768px')

  const navItems = [['/', 'Home'], ['/search', 'Search']] as const
</script>

{#if md.current}
  <!-- desktop -->
  <div class='grid grid-cols-[12rem_1fr]'>
    <div class='top-0 z-50 sticky flex flex-col gap-2 bg-zinc-700/50 p-4 border-zinc-100/10 border-r h-svh'>
      {#each navItems as [href, label]}
        {@const isCurrent = page.url.pathname === `/${href.replace('/', '')}`}
        <Button {href} variant={isCurrent ? 'primary' : 'secondary'}>
          {label}
        </Button>
      {/each}
    </div>
    <div class='isolate relative'>
      {@render children()}
      <div class='right-0 bottom-0 left-[12rem] z-50 fixed bg-zinc-700/75 backdrop-blur-lg'>
        {@render nowPlayingBar()}
      </div>
    </div>
  </div>

{:else}
  <!-- mobile -->
  {@render children()}

  <div class='bottom-0 z-50 fixed inset-x-0 bg-zinc-700/75 backdrop-blur-lg'>
    {@render nowPlayingBar()}

    <nav class='flex justify-center items-center gap-2 p-4'>
      {#each navItems as [href, label]}
        {@const isCurrent = page.url.pathname === `/${href.replace('/', '')}`}
        <Button {href} variant={isCurrent ? 'primary' : 'secondary'}>
          {label}
        </Button>
      {/each}
    </nav>
  </div>
{/if}

{#snippet nowPlayingBar()}
  {#if global.nowPlaying}
    <div class='max-md:border-zinc-100/10 max-md:border-b'>
      <div class='items-center gap-4 grid grid-cols-[1fr_auto] mx-auto p-4 max-w-xl'>

        <button onclick={() => show = true} class='flex gap-4 text-left truncate'>
          <ListingThumbnail src={global.nowPlaying.artwork_url} alt='' />

          <div class='flex flex-col w-full min-w-0'>
            <h3 class='truncate'>{global.nowPlaying.title}</h3>
            <p class='opacity-50 truncate'>{global.nowPlaying.user.username}</p>
          </div>
        </button>

        <Button
          size='icon'
          variant='secondary'
          onclick={() => {
            haptic()
            global.isPaused = !global.isPaused
          }}
        >
          <StatusIcon fill='currentColor' class='opacity-50' size={16} />
        </Button>
      </div>
    </div>
  {/if}
{/snippet}
