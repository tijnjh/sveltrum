  <script lang='ts'>
  import { page } from '$app/state'
  import { global } from '$lib/global.svelte'
  import { PauseIcon, PlayIcon } from '@lucide/svelte'
  import { haptic } from 'ios-haptics'
  import Button from './Button.svelte'

  let { show = $bindable(), isPaused = $bindable() }: { show: boolean, isPaused: boolean } = $props()

  const StatusIcon = $derived(isPaused ? PlayIcon : PauseIcon)
</script>

<div class='bottom-0 fixed inset-x-0 bg-zinc-700/75 backdrop-blur-lg'>
  {#if global.nowPlaying}
    <div class='p-4 border-zinc-100/10'>
      <div class='items-center gap-4 grid grid-cols-[1fr_auto]'>

        <button onclick={() => show = true} class='flex text-left gap-4 truncate'>
          <img src={global.nowPlaying?.artwork_url} alt="" class='rounded size-12 aspect-square'>

          <div class='flex flex-col w-full min-w-0'>
            <h3 class='truncate'>{global.nowPlaying?.title}</h3>
            <p class='opacity-50 truncate'>{global.nowPlaying?.user.username}</p>
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
