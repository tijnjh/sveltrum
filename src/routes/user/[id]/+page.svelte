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
  import { parseAsString, useQueryState } from 'nuqs-svelte'
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'

  const id = Number(page.params!.id)

  let user: User | null = $state(null)

  const selectedKind = useQueryState('kind', parseAsString.withDefault('tracks').withOptions({
    shallow: false,
    history: 'push',
  }))

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

  onMount(async () => {
    const res = await getUserById(id)

    if (res.isErr()) {
      toast.error(`faield to get user: ${res.error}`)
      return
    }

    user = res.value
  })

  async function doFetch() {
    isLoading = true

    const kind = selectedKind.current ?? 'tracks'

    const res = await getUser(kind)({
      id,
      index: currentIndex,
    })

    if (res.isErr()) {
      toast.error(`faield to get user ${kind}: ${res.error}`)
      return
    }

    hasMoreResults = res.value.hasMore

    results = [...results, ...res.value.results]
    isLoading = false
  }

  doFetch()
</script>

<svelte:head>
  <title>{user?.username} &bull; sveltrum</title>
  <link rel='icon' href={user?.avatar_url} />
</svelte:head>

<img src={user?.avatar_url.replace('large', 't500x500')} class='w-full aspect-square md:max-w-md' alt="">

<div class='top-0 z-50 sticky inset-x-0 flex flex-col gap-4 bg-zinc-700/75 backdrop-blur-lg p-4 w-full'>
  <h1 class='font-medium text-2xl'>{user?.username}</h1>
</div>

<main class='flex flex-col gap-4 p-4'>

  <div class='flex gap-2'>
    {#each ['tracks', 'playlists'] as kind}
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
    {/each}
  </div>

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
  {:else if hasMoreResults}
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
</main>
