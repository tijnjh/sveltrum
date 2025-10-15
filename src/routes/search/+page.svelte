<script lang="ts">
	import {
		searchPlaylists,
		searchTracks,
		searchUsers,
	} from '$lib/api/search.remote'
	import Main from '$lib/components/Main.svelte'
	import Spinner from '$lib/components/Spinner.svelte'
	import PlaylistListing from '$lib/components/listings/PlaylistListing.svelte'
	import TrackListing from '$lib/components/listings/TrackListing.svelte'
	import UserListing from '$lib/components/listings/UserListing.svelte'
	import Button from '$lib/components/ui/Button.svelte'
	import Input from '$lib/components/ui/Input.svelte'
	import { paginated_limit } from '$lib/constants'
	import type { Playlist } from '$lib/schemas/playlist'
	import type { Track } from '$lib/schemas/track'
	import type { User } from '$lib/schemas/user'
	import { whenInView } from '$lib/utils'
	import { SearchIcon } from '@lucide/svelte'
	import { createInfiniteQuery } from '@tanstack/svelte-query'
	import { Debounced } from 'runed'
	import { useSearchParams } from 'runed/kit'
	import { z } from 'zod'

	const params = useSearchParams(
		z.object({
			q: z.string().default(''),
			kind: z.enum(['tracks', 'playlists', 'users']).default('tracks'),
		}),
	)

	const debouncedQ = new Debounced(() => params.q, 500)

	const query = createInfiniteQuery(() => ({
		queryKey: ['search', debouncedQ.current, params.kind],
		queryFn: async ({ pageParam = 0 }) => {
			if (!debouncedQ.current) return []

			const data = {
				query: debouncedQ.current,
				offset: pageParam * paginated_limit,
				limit: paginated_limit,
			}

			let results: (Track | Playlist | User)[] = []

			switch (params.kind) {
				case 'playlists':
					results = await searchPlaylists(data)
					break

				case 'users':
					results = await searchUsers(data)
					break
				default:
					results = await searchTracks(data)
					break
			}

			return results as (Track | Playlist | User)[]
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.length < paginated_limit ? allPages.length : undefined,
	}))
</script>

<svelte:head>
	<title>results for '{debouncedQ.current}' &bull; sveltrum</title>
</svelte:head>

<Main>
	{#snippet left()}
		<form
			onsubmit={(e) => {
				e.preventDefault()
				query.refetch()
			}}
			class="mx-auto flex w-full max-w-xl gap-2"
		>
			<Input
				type="text"
				bind:value={params.q}
				class="w-full"
				placeholder="Search"
				icon={SearchIcon}
			/>
		</form>

		<div class="mx-auto flex w-full max-w-xl gap-2">
			{#each ['tracks', 'playlists', 'users'] as const as kind (kind)}
				{#key params.kind}
					<Button
						variant={params.kind === kind ? 'primary' : 'secondary'}
						class="capitalize"
						onclick={() => {
							params.kind = kind
							query.refetch()
						}}
					>
						{kind}
					</Button>
				{/key}
			{/each}
		</div>
	{/snippet}

	{#snippet right()}
		<div class="flex flex-col gap-4">
			{#each query.data?.pages as page (page)}
				{#each page as result (result.id)}
					{#if params.kind === 'tracks'}
						<TrackListing track={result as Track} />
					{:else if params.kind === 'playlists'}
						<PlaylistListing playlist={result as Playlist} />
					{:else if params.kind === 'users'}
						<UserListing user={result as User} />
					{/if}
				{/each}
			{:else}
				{#if !query.isLoading}
					<span class="mt-4 text-zinc-100/25 text-lg">Nothing here...</span>
				{/if}
			{/each}
		</div>

		{#if query.isLoading}
			<Spinner />
		{:else if debouncedQ.current && query.hasNextPage}
			<Button
				class="mt-8 w-full"
				onclick={() => {
					query.fetchNextPage()
				}}
				{@attach whenInView(() => {
					if (query.isFetching) return
					query.fetchNextPage()
				})}
			>
				Load more
			</Button>
		{/if}
	{/snippet}
</Main>
