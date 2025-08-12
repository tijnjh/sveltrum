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
  import { parseAsStringEnum, useQueryState } from 'nuqs-svelte'
  import { onMount } from 'svelte'

  let isLoading = $state(false)

  const qSearch = useQueryState('q')
  const qKind = useQueryState('kind', parseAsStringEnum(['tracks', 'playlists', 'users']).withDefault('tracks'))

  let results = $state<(Track | Playlist | User)[]>([])

  onMount(() => {
    qSearch && doFetch()
  })

  function searchFor(kind: string) {
    switch (kind) {
      case 'tracks': return searchTracks
      case 'playlists': return searchPlaylists
      case 'users': return searchUsers
      default: throw new Error(`unknown kind: ${kind}`)
    }
  }

  let currentOffset = $state(0)

  async function doFetch() {
    if (qSearch.current) {
      isLoading = true

      const newResults = await searchFor(qKind.current)({
        query: qSearch.current,
        limit: 16,
        offset: currentOffset,
      })

      results = [...results, ...newResults]
      isLoading = false
    }
  }
</script>

<svelte:head>
  <title>results for '{qSearch.current}' &bull; sveltrum</title>
</svelte:head>

<div class='flex flex-col z-50 gap-4 w-full sticky p-4 top-0 inset-x-0  bg-zinc-700/75 backdrop-blur-lg'>
  <form
    onsubmit={(e) => {
      e.preventDefault()
      results = []
      currentOffset = 0
      doFetch()
    }}
    class='flex gap-2'
  >
    <input
      type='text'
      bind:value={qSearch.current}
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
        variant={qKind.current === kind ? 'primary' : 'secondary'}
        class='capitalize'
        onclick={() => {
          qKind.current = kind as typeof qKind.current
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
      {#if qKind.current === 'tracks'}
        <TrackListing track={result as Track} />
      {:else if qKind.current === 'playlists'}
        <PlaylistListing playlist={result as Playlist} />
      {:else if qKind.current === 'users'}
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
