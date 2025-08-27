  <script lang='ts'>
  import type { Snippet } from 'svelte'
  import { page } from '$app/state'
  import { isPaused, nowPlaying } from '$lib/global.svelte'
  import { PauseIcon, PlayIcon } from '@lucide/svelte'
  import { haptic } from 'ios-haptics'
  import { MediaQuery } from 'svelte/reactivity'
  import Button from './Button.svelte'
  import ListingThumbnail from './ListingThumbnail.svelte'

  let { show = $bindable(), children }: { show: boolean, children: Snippet } = $props()

  const StatusIcon = $derived(isPaused.current ? PlayIcon : PauseIcon)

  const md = new MediaQuery('width > 768px')

  const navItems = [['/', 'Home'], ['/search', 'Search']] as const
</script>

{#if md.current}
  <!-- desktop -->
  <div class='grid grid-cols-[12rem_1fr]'>
    <div class='flex flex-col gap-2 z-50 p-4 border-r h-svh sticky top-0 border-zinc-100/10 bg-zinc-700/50'>
      {#each navItems as [href, label]}
        {@const isCurrent = page.url.pathname === `/${href.replace('/', '')}`}
        <Button {href} variant={isCurrent ? 'primary' : 'secondary'}>
          {label}
        </Button>
      {/each}
    </div>
    <div class='relative isolate'>
      {@render children()}
      <div class='fixed bottom-0 z-50 left-[12rem] right-0 bg-zinc-700/75 backdrop-blur-lg'>
        {@render nowPlayingBar()}
      </div>
    </div>
  </div>

{:else}
  <!-- mobile -->
  {@render children()}

  <div class='bottom-0 fixed z-50 inset-x-0 bg-zinc-700/75 backdrop-blur-lg'>
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
  {#if nowPlaying.current}
    <div class='max-md:border-zinc-100/10 max-md:border-b'>
      <div class='items-center max-w-xl mx-auto p-4 gap-4 grid grid-cols-[1fr_auto]'>

        <button onclick={() => show = true} class='flex text-left gap-4 truncate'>
          <ListingThumbnail src={nowPlaying.current.artwork_url} alt='' />

          <div class='flex flex-col w-full min-w-0'>
            <h3 class='truncate'>{nowPlaying.current.title}</h3>
            <p class='opacity-50 truncate'>{nowPlaying.current.user.username}</p>
          </div>
        </button>

        <Button
          size='icon'
          variant='secondary'
          onclick={() => {
            haptic()
            isPaused.current = !isPaused.current
          }}
        >
          <StatusIcon fill='currentColor' class='opacity-50' size={16} />
        </Button>
      </div>
    </div>
  {/if}
{/snippet}
