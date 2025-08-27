  <script lang='ts'>
  import { page } from '$app/state'
  import { nowPlaying } from '$lib/global.svelte'
  import { PauseIcon, PlayIcon } from '@lucide/svelte'
  import { haptic } from 'ios-haptics'
  import Button from './Button.svelte'
  import ListingThumbnail from './ListingThumbnail.svelte'

  let { show = $bindable(), isPaused = $bindable() }: { show: boolean, isPaused: boolean } = $props()

  const StatusIcon = $derived(isPaused ? PlayIcon : PauseIcon)
</script>

<div class='bottom-0 fixed z-50 inset-x-0 bg-zinc-700/75 backdrop-blur-lg'>
  {#if nowPlaying.current}
    <div class=' border-zinc-100/10 border'>
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
            isPaused = !isPaused
          }}
        >
          <StatusIcon fill='currentColor' class='opacity-50' size={16} />
        </Button>
      </div>
    </div>
  {/if}

  <nav class='flex justify-center items-center gap-2 p-4'>
    {#each [['/', 'Home'], ['/search', 'Search']] as const as [href, label]}
      {@const isCurrent = page.url.pathname === `/${href.replace('/', '')}`}
      <Button {href} variant={isCurrent ? 'primary' : 'secondary'}>
        {label}
      </Button>
    {/each}
  </nav>
</div>
