<script lang='ts'>
  import type { Track } from '$lib/types'
  import Button from '$lib/components/Button.svelte'
  import { global } from '$lib/global.svelte'
  import { getResults } from '$lib/srv/soundcloud.remote'
  import { SearchIcon } from '@lucide/svelte'
  import { useQueryState } from 'nuqs-svelte'
  import { onMount } from 'svelte'

  const query = useQueryState('q')

  let results: Track[] | null = $state(null)

  onMount(() => {
    if (query) {
      onsubmit()
    }
  })

  async function onsubmit(e?: Event) {
    e && e.preventDefault()

    if (query.current) {
      results = await getResults({ query: query.current, limit: 50 })
    }
  }
</script>

<form {onsubmit} class='flex z-50 gap-2 w-full sticky p-4 top-0 inset-x-0  bg-zinc-700/75 backdrop-blur-lg'>
  <input
    type='text'
    bind:value={query.current}
    class='bg-zinc-700 h-10 px-4 grow rounded-full'
    placeholder='Search'
  />

  <Button type='submit' size='icon'>
    <SearchIcon size={16} strokeWidth={3} />
  </Button>
</form>

<main class='p-4'>
  {#if results}
    <div class='flex flex-col gap-4'>
      {#each results as track}
        <button
          onclick={() => { global.nowPlaying = track }}
          class='items-center text-left gap-4 grid grid-cols-[auto_1fr] active:scale-95 transition-transform active:opacity-50'
        >
          <img src={track.artwork_url} alt="" class=' rounded-md size-12 aspect-square'>
          <div class='flex flex-col w-full min-w-0'>
            <h3 class='truncate'>{track.title}</h3>
            <p class='truncate opacity-50'>{track.user.username}</p>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</main>
