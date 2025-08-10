<script lang='ts'>
  import { page } from '$app/state'
  import Button from '$lib/components/ui/button/button.svelte'
  import { global } from '$lib/global.svelte'
  import { getResults } from '$lib/srv/soundcloud.remote'

  const query = page.url.searchParams.get('q')
</script>

{#if query}
  {#await getResults({ query: query!, limit: 50 })}
    loading...
  {:then tracks}
    {#if tracks}
      <div class='flex flex-col gap-2'>
        {#each tracks as track}
          <Button
            variant='outline'
            class='grid grid-cols-[max-content_1fr] text-left grid-rows-2 h-fit justify-start'
            onclick={() => { global.nowPlaying = track }}
          >
            <img src={track.artwork_url} alt="" class='size-9 row-span-2' />
            <h3>{global.nowPlaying?.id === track.id ? 'Currently playing: ' : ''}{track.title}</h3>
            {track.user.username}
          </Button>

        {/each}
      </div>
    {/if}
  {/await}
{:else}
  Please provide a query
{/if}
