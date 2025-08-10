<script lang='ts'>
  import { page } from '$app/state'
  import { getResults } from '$lib/srv/soundcloud.remote'

  const query = page.url.searchParams.get('q')
</script>

{#if query}
  {#await getResults({ query: query!, limit: 50 })}
    loading...
  {:then tracks}
    {#if tracks}
      {#each tracks as track}
        <a href='/track/{track.id}' class='block'>
          <img src={track.artwork_url} alt={track.description} />
          {track.title}
        </a>
      {/each}
    {/if}
  {/await}
{:else}
  Please provide a query
{/if}
