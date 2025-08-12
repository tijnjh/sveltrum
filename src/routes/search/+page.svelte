<script lang='ts'>
  import type { Playlist } from '$lib/schemas/playlist'
  import type { Track } from '$lib/schemas/track'
  import type { User } from '$lib/schemas/user'
  import Button from '$lib/components/Button.svelte'
  import PlaylistListing from '$lib/components/listings/PlaylistListing.svelte'
  import TrackListing from '$lib/components/listings/TrackListing.svelte'
  import UserListing from '$lib/components/listings/UserListing.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import { searchPlaylists, searchTracks, searchUsers } from '$lib/srv/api.remote'
  import { SearchIcon } from '@lucide/svelte'

  import { onMount } from 'svelte'
  import { queryParameters } from 'sveltekit-search-params'

  let isLoading = $state(false)

  const params = queryParameters({ q: true, kind: true })

  let results = $state<(Track | Playlist | User)[]>([])

  let query = $state($params.q)

  onMount(() => {
    $params.q && doFetch()
  })

  function searchFor(kind: string) {
    switch (kind) {
      case 'playlists': return searchPlaylists
      case 'users': return searchUsers
      default: return searchTracks
    }
  }

  let currentOffset = $state(0)

  async function doFetch() {
    if ($params.q) {
      isLoading = true

      const newResults = await searchFor($params.kind ?? 'tracks')({
        query: $params.q,
        limit: 16,
        offset: currentOffset,
      })

      results = [...results, ...newResults]
      isLoading = false
    }
  }
</script>

<svelte:head>
  <title>results for '{$params.q}' &bull; sveltrum</title>
</svelte:head>

<div class='flex flex-col z-50 gap-4 w-full sticky p-4 top-0 inset-x-0  bg-zinc-700/75 backdrop-blur-lg'>
  <form
    onsubmit={(e) => {
      $params.q = query
      e.preventDefault()
      results = []
      currentOffset = 0
      doFetch()
    }}
    class='flex gap-2'
  >
    <input
      type='text'
      bind:value={query}
      class='bg-zinc-700 h-10 px-4 grow rounded-full'
      placeholder='Search'
    />

    <Button type='submit' size='icon'>
      <SearchIcon size={16} strokeWidth={3} />
    </Button>
  </form>
  <div class='flex gap-2'>
    {#each ['tracks', 'playlists', 'users'] as kind}
      <Button
        variant={$params.kind === kind ? 'primary' : 'secondary'}
        class='capitalize'
        onclick={() => {
          $params.kind = kind
          results = []
          currentOffset = 0
          doFetch()
        }}
      >
        {kind}
      </Button>
    {/each}
  </div>
</div>

<main class='p-4'>
  <div class='flex flex-col gap-4'>
    {#each results as result}
      {#if $params.kind === 'tracks'}
        <TrackListing track={result as Track} />
      {:else if $params.kind === 'playlists'}
        <PlaylistListing playlist={result as Playlist} />
      {:else if $params.kind === 'users'}
        <UserListing user={result as User} />
      {/if}
    {/each}
  </div>

  {#if isLoading}
    <Spinner />
  {:else}
    <Button
      class='w-full mt-8'
      onclick={() => {
        currentOffset += 16
        doFetch()
      }}
    >
      Load more
    </Button>
  {/if}
</main>
