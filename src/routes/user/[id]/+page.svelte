<script lang='ts'>
  import type { Playlist } from '$lib/schemas/playlist'
  import type { Track } from '$lib/schemas/track'
  import type { User } from '$lib/schemas/user'
  import { page } from '$app/state'
  import Button from '$lib/components/Button.svelte'
  import PlaylistListing from '$lib/components/listings/PlaylistListing.svelte'
  import TrackListing from '$lib/components/listings/TrackListing.svelte'
  import UserListing from '$lib/components/listings/UserListing.svelte'
  import Spinner from '$lib/components/Spinner.svelte'
  import { getUserById, getUserPlaylists, getUserTracks } from '$lib/srv/api.remote'
  import { parseAsStringEnum, useQueryState } from 'nuqs-svelte'

  const id = Number(page.params!.id)
  //  @ts-expect-error
  const user = await getUserById(id)

  let isLoading = $state(false)

  const qKind = useQueryState('kind', parseAsStringEnum(['tracks', 'playlists', 'users']).withDefault('tracks'))

  let results = $state<(Track | Playlist | User)[]>([])

  function getUser(kind: string) {
    switch (kind) {
      case 'tracks': return getUserTracks
      case 'playlists': return getUserPlaylists
      default: throw new Error(`unknown kind: ${kind}`)
    }
  }

  let currentOffset = $state(0)

  async function doFetch() {
    isLoading = true

    const newResults = await getUser(qKind.current)({
      id,
      limit: 16,
      offset: currentOffset,
    })

    results = [...results, ...newResults]
    isLoading = false
  }

  doFetch()
</script>

<svelte:head>
  <title>{user?.username} &bull; sveltrum</title>
  <link rel='icon' href={user?.avatar_url} />
</svelte:head>

<main class='p-4 flex flex-col gap-4'>
  {#if user}
    <div class='flex items-center gap-4 justify-start'>
      {#if user.avatar_url}
        <img src={user.avatar_url} class='rounded' alt='Album cover for {user.username}'>
      {/if}
      <hgroup>
        <h1 class='font-medium text-2xl'>{user.username}</h1>
        <p>{user.followers_count.toLocaleString()} followers</p>
      </hgroup>
    </div>

    <div class='flex gap-2'>
      {#each ['tracks', 'playlists'] as kind}
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
  {/if}
</main>
