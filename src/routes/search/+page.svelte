<script lang="ts">
	import {
		searchPlaylists,
		searchTracks,
		searchUsers,
	} from '$lib/api/search.remote'
	import InfiniteQueryView from '$lib/components/InfiniteQueryView.svelte'
	import Main from '$lib/components/Main.svelte'
	import Button from '$lib/components/ui/Button.svelte'
	import Input from '$lib/components/ui/Input.svelte'
	import { paginated_limit } from '$lib/constants'
	import type { Playlist } from '$lib/schemas/playlist'
	import type { Track } from '$lib/schemas/track'
	import type { User } from '$lib/schemas/user'
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
		<InfiniteQueryView {query} />
	{/snippet}
</Main>
