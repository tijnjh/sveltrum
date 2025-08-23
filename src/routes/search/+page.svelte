<script lang='ts'>
  import type { Playlist } from '$lib/schemas/playlist'
  import type { Track } from '$lib/schemas/track'
  import type { User } from '$lib/schemas/user'
  import { searchPlaylists, searchTracks, searchUsers } from '$lib/api/search.remote'
  import { effectFromRq } from '$lib/api/utils'
  import Button from '$lib/components/Button.svelte'
  import PlaylistListing from '$lib/components/listings/PlaylistListing.svelte'
  import TrackListing from '$lib/components/listings/TrackListing.svelte'
  import UserListing from '$lib/components/listings/UserListing.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import { SearchIcon } from '@lucide/svelte'
  import { Effect } from 'effect'
  import { parseAsString, useQueryState } from 'nuqs-svelte'
  import { onMount } from 'svelte'

  let isLoading = $state(false)

  let results = $state<(Track | Playlist | User)[]>([])

  const query = useQueryState('q', { shallow: false, history: 'push' })

  const selectedKind = useQueryState('kind', parseAsString.withDefault('tracks').withOptions({
    shallow: false,
    history: 'push',
  }))

  function searchFor(kind: string) {
    switch (kind) {
      case 'playlists': return effectFromRq(() => searchPlaylists)
      case 'users': return effectFromRq(() => searchUsers)
      default: return effectFromRq(() => searchTracks)
    }
  }

  let currentIndex = $state(0)

  let hasMoreResults = $state(false)

  export const doFetch = Effect.gen(function* () {
    if (!query.current) {
      return
    }

    isLoading = true

    const { results: newResults, hasMore } = yield* searchFor(selectedKind.current ?? 'tracks')({
      query: query.current,
      index: currentIndex,
    })

    hasMoreResults = hasMore

    results = [...results, ...newResults]
    isLoading = false
  })

  onMount(() => {
    if (query) {
      doFetch.pipe(Effect.runPromise)
    }
  })

  function onsubmit(e: Event) {
    e.preventDefault()
    results = []
    currentIndex = 0
    doFetch.pipe(Effect.runPromise)
  }
</script>

<svelte:head>
  <title>results for '{query.current}' &bull; sveltrum</title>
</svelte:head>

<div class='top-0 z-50 sticky inset-x-0 flex flex-col gap-4 bg-zinc-700/75 backdrop-blur-lg p-4 w-full'>
  <form {onsubmit} class='flex gap-2'>
    <input
      type='text'
      bind:value={query.current}
      class='bg-zinc-700 px-4 rounded-full h-10 grow'
      placeholder='Search'
    />

    <Button type='submit' size='icon'>
      <SearchIcon size={16} strokeWidth={3} />
    </Button>
  </form>
  <div class='flex gap-2'>
    {#each ['tracks', 'playlists', 'users'] as kind}
      {#key selectedKind.current}
        <Button
          variant={selectedKind.current === kind ? 'primary' : 'secondary'}
          class='capitalize'
          onclick={() => {
            selectedKind.current = kind
            results = []
            currentIndex = 0
            doFetch()
          }}
        >
          {kind}
        </Button>
      {/key}

    {/each}
  </div>
</div>

<main class='p-4'>
  <div class='flex flex-col gap-4'>
    {#each results as result}
      {#if selectedKind.current === 'tracks'}
        <TrackListing track={result as Track} />
      {:else if selectedKind.current === 'playlists'}
        <PlaylistListing playlist={result as Playlist} />
      {:else if selectedKind.current === 'users'}
        <UserListing user={result as User} />
      {/if}
    {/each}
  </div>

  {#if isLoading}
    <Spinner />
  {:else}
    {#if query && hasMoreResults}
      <Button
        class='mt-8 w-full'
        onclick={() => {
          currentIndex++
          doFetch()
        }}
      >
        Load more
      </Button>
    {/if}
  {/if}
</main>
