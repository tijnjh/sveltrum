<script lang="ts">
	import { page } from '$app/state'
	import {
		getUserById,
		getUserPlaylists,
		getUserTracks,
	} from '$lib/api/user.remote'
	import Button from '$lib/components/Button.svelte'
	import HeroSection from '$lib/components/HeroSection.svelte'
	import Main from '$lib/components/Main.svelte'
	import Spinner from '$lib/components/Spinner.svelte'
	import PlaylistListing from '$lib/components/listings/PlaylistListing.svelte'
	import TrackListing from '$lib/components/listings/TrackListing.svelte'
	import { paginated_limit } from '$lib/constants'
	import type { Playlist } from '$lib/schemas/playlist'
	import type { Track } from '$lib/schemas/track'
	import { createInfiniteQuery } from '@tanstack/svelte-query'
	import { useSearchParams } from 'runed/kit'
	import { z } from 'zod'

	const id = Number(page.params!.id)

	const user = await getUserById(id)

	const params = useSearchParams(
		z.object({
			kind: z.enum(['tracks', 'playlists']).default('tracks'),
		}),
	)

	const query = createInfiniteQuery(() => ({
		queryKey: ['user', id, params.kind],
		queryFn: async ({ pageParam = 0 }) => {
			const data = {
				id: Number(id),
				offset: pageParam * paginated_limit,
				limit: paginated_limit,
			}

			let results: (Track | Playlist)[] = []

			switch (params.kind) {
				case 'playlists':
					results = await getUserPlaylists(data)
					break
				default:
					results = await getUserTracks(data)
					break
			}

			return results
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.length < paginated_limit ? allPages.length : undefined,
	}))
</script>

<svelte:head>
	<title>{user?.username} &bull; sveltrum</title>
	<link rel="icon" href={user?.avatar_url} />
</svelte:head>

<Main>
	<HeroSection
		pictureSrc={user.avatar_url}
		title={user.username}
		roundedPicture
	/>

	<div class="flex gap-2">
		{#each ['tracks', 'playlists'] as const as kind (kind)}
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
		{/each}
	</div>

	<div class="flex flex-col gap-4">
		{#each query.data?.pages as page (page)}
			{#each page as result (result.id)}
				{#if params.kind === 'tracks'}
					<TrackListing track={result as Track} />
				{:else if params.kind === 'playlists'}
					<PlaylistListing playlist={result as Playlist} />
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
	{:else if query.hasNextPage}
		<Button
			class="mt-8 w-full"
			onclick={() => {
				query.fetchNextPage()
			}}
		>
			Load more
		</Button>
	{/if}
</Main>
