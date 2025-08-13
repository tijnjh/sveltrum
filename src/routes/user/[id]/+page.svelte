<script lang='ts'>
  import type { Playlist } from '$lib/schemas/playlist'
  import type { Track } from '$lib/schemas/track'
  import type { User } from '$lib/schemas/user'
  import { page } from '$app/state'
  import { getUserById } from '$lib/api/get-by-id.remote'
  import { getUserPlaylists, getUserTracks } from '$lib/api/user.remote'
  import Button from '$lib/components/Button.svelte'
  import PlaylistListing from '$lib/components/listings/PlaylistListing.svelte'
  import TrackListing from '$lib/components/listings/TrackListing.svelte'
  import UserListing from '$lib/components/listings/UserListing.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import { queryParameters } from 'sveltekit-search-params'

  const id = Number(page.params!.id)
  //  @ts-expect-error tla
  const user = await getUserById(id)

  const params = queryParameters({
    kind: {
      encode: v => v,
      decode: v => v,
      defaultValue: 'tracks',
    },
  })

  let isLoading = $state(false)

  let results = $state<(Track | Playlist | User)[]>([])

  function getUser(kind: string) {
    switch (kind) {
      case 'playlists': return getUserPlaylists
      default: return getUserTracks
    }
  }

  let currentIndex = $state(0)
  let hasMoreResults = $state(true)

  async function doFetch() {
    isLoading = true

    const { results: newResults, hasMore } = await getUser($params.kind ?? 'tracks')({
      id,
      index: currentIndex,
    })

    hasMoreResults = hasMore

    results = [...results, ...newResults]
    isLoading = false
  }

  doFetch()
</script>

<svelte:head>
  <title>{user?.username} &bull; sveltrum</title>
  <link rel='icon' href={user?.avatar_url} />
</svelte:head>

<img src={user.avatar_url} class='w-full md:max-w-md' alt="">

<div class='flex flex-col z-50 gap-4 w-full sticky p-4 top-0 inset-x-0  bg-zinc-700/75 backdrop-blur-lg'>
  <h1 class='font-medium text-2xl'>{user.username}</h1>
</div>

<main class='p-4 flex flex-col gap-4'>

  <div class='flex gap-2'>
    {#each ['tracks', 'playlists'] as kind}
      <Button
        variant={$params.kind === kind ? 'primary' : 'secondary'}
        class='capitalize'
        onclick={() => {
          $params.kind = kind
          results = []
          currentIndex = 0
          doFetch()
        }}
      >
        {kind}
      </Button>
    {/each}
  </div>

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
  {:else if hasMoreResults}
    <Button
      class='w-full mt-8'
      onclick={() => {
        currentIndex++
        doFetch()
      }}
    >
      Load more
    </Button>
  {/if}
</main>
