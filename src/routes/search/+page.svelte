<script lang="ts">
	import {
		searchPlaylists,
		searchTracks,
		searchUsers,
	} from '$lib/api/search.remote'
	import Button from '$lib/components/Button.svelte'
	import Main from '$lib/components/Main.svelte'
	import Spinner from '$lib/components/Spinner.svelte'
	import PlaylistListing from '$lib/components/listings/PlaylistListing.svelte'
	import TrackListing from '$lib/components/listings/TrackListing.svelte'
	import UserListing from '$lib/components/listings/UserListing.svelte'
	import type { Playlist } from '$lib/schemas/playlist'
	import type { Track } from '$lib/schemas/track'
	import type { User } from '$lib/schemas/user'
	import { SearchIcon } from '@lucide/svelte'
	import { parseAsString, useQueryState } from 'nuqs-svelte'
	import { onMount } from 'svelte'

	let isLoading = $state(false)

	let results = $state<(Track | Playlist | User)[]>([])

	const query = useQueryState('q', { shallow: false, history: 'push' })

	const selectedKind = useQueryState(
		'kind',
		parseAsString.withDefault('tracks').withOptions({
			shallow: false,
			history: 'push',
		}),
	)

	onMount(() => {
		if (query) {
			doFetch()
		}
	})

	function searchFor(kind: string) {
		switch (kind) {
			case 'playlists':
				return searchPlaylists
			case 'users':
				return searchUsers
			default:
				return searchTracks
		}
	}

	let currentIndex = $state(0)

	let hasMoreResults = $state(false)

	async function doFetch() {
		if (!query.current) {
			return
		}

		isLoading = true

		const { results: newResults, hasMore } = await searchFor(
			selectedKind.current ?? 'tracks',
		)({
			query: query.current,
			index: currentIndex,
		})

		hasMoreResults = hasMore

		results = [...results, ...newResults]
		isLoading = false
	}

	function onsubmit(e: Event) {
		e.preventDefault()
		results = []
		currentIndex = 0
		doFetch()
	}
</script>

<svelte:head>
	<title>results for '{query.current}' &bull; sveltrum</title>
</svelte:head>

<div
	class="sticky inset-x-0 top-0 z-50 flex w-full flex-col gap-4 bg-zinc-700/75 p-4 backdrop-blur-lg"
>
	<form {onsubmit} class="mx-auto flex w-full max-w-xl gap-2">
		<input
			type="text"
			bind:value={query.current}
			class="h-10 grow rounded-full bg-zinc-700 px-4"
			placeholder="Search"
		/>

		<Button type="submit" size="icon">
			<SearchIcon size={16} strokeWidth={3} />
		</Button>
	</form>
	<div class="mx-auto flex w-full max-w-xl gap-2">
		{#each ['tracks', 'playlists', 'users'] as kind (kind)}
			{#key selectedKind.current}
				<Button
					variant={selectedKind.current === kind ? 'primary' : 'secondary'}
					class="capitalize"
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

<Main>
	<div class="flex flex-col gap-4">
		{#each results as result (result.id)}
			{#if selectedKind.current === 'tracks'}
				<TrackListing track={result as Track} />
			{:else if selectedKind.current === 'playlists'}
				<PlaylistListing playlist={result as Playlist} />
			{:else if selectedKind.current === 'users'}
				<UserListing user={result as User} />
			{/if}
		{:else}
			{#if !isLoading}
				<span class="mt-4 text-zinc-100/25 text-lg"> Nothing here... </span>
			{/if}
		{/each}
	</div>

	{#if isLoading}
		<Spinner />
	{:else if query && hasMoreResults}
		<Button
			class="mt-8 w-full"
			onclick={() => {
				currentIndex++
				doFetch()
			}}
		>
			Load more
		</Button>
	{/if}
</Main>
