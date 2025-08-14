  <script lang='ts'>
  import { page } from '$app/state'
  import { global } from '$lib/global.svelte'
  import { PauseIcon, PlayIcon } from '@lucide/svelte'
  import { haptic } from 'ios-haptics'
  import Button from './Button.svelte'
  import ListingThumbnail from './ListingThumbnail.svelte'

  let { show = $bindable(), isPaused = $bindable() }: { show: boolean, isPaused: boolean } = $props()

  const StatusIcon = $derived(isPaused ? PlayIcon : PauseIcon)
</script>

<div class='bottom-0 fixed md:grid md:grid-cols-3 inset-x-0 bg-zinc-700/75 backdrop-blur-lg'>
  <div class='p-4 border-zinc-100/10 order-1'>
    <div class='items-center gap-4 w-full max-w-xl grid grid-cols-[1fr_auto]'>
      <button onclick={() => global.nowPlaying ? show = true : null} class='flex text-left gap-4 truncate'>
        <ListingThumbnail src={global.nowPlaying?.artwork_url} />

        <div class='flex flex-col w-full min-w-0'>
          <h3 class='truncate'>{global.nowPlaying?.title ?? 'Nothing playing'}</h3>
          <p class='opacity-50 truncate'>{global.nowPlaying?.user.username ?? 'Uknown artist'}</p>
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

  <nav class='flex justify-center md:justify-start items-center gap-2 p-4'>
    {#each [['/', 'Home'], ['/search', 'Search']] as const as [href, label]}
      {@const isCurrent = page.url.pathname === `/${href.replace('/', '')}`}
      <Button {href} variant={isCurrent ? 'primary' : 'secondary'}>
        {label}
      </Button>
    {/each}
  </nav>
</div>
