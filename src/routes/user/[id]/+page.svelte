<script lang="ts">
	import { page } from '$app/state'
	import { getUserById } from '$lib/api/get-by-id.remote'
	import { getUserPlaylists, getUserTracks } from '$lib/api/user.remote'
	import Button from '$lib/components/Button.svelte'
	import HeroSection from '$lib/components/HeroSection.svelte'
	import Main from '$lib/components/Main.svelte'
	import Spinner from '$lib/components/Spinner.svelte'
	import PlaylistListing from '$lib/components/listings/PlaylistListing.svelte'
	import TrackListing from '$lib/components/listings/TrackListing.svelte'
	import type { Playlist } from '$lib/schemas/playlist'
	import type { Track } from '$lib/schemas/track'
	import type { User } from '$lib/schemas/user'
	import { parseAsString, useQueryState } from 'nuqs-svelte'

	const id = Number(page.params!.id)

	const user = await getUserById(id)

	const selectedKind = useQueryState(
		'kind',
		parseAsString.withDefault('tracks').withOptions({
			shallow: false,
			history: 'push',
		}),
	)

	let isLoading = $state(false)

	let results = $state<(Track | Playlist | User)[]>([])

	function getUser(kind: string) {
		switch (kind) {
			case 'playlists':
				return getUserPlaylists
			default:
				return getUserTracks
		}
	}

	let currentIndex = $state(0)
	let hasMoreResults = $state(true)

	async function doFetch() {
		isLoading = true

		const { results: newResults, hasMore } = await getUser(
			selectedKind.current ?? 'tracks',
		)({
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
	<link rel="icon" href={user?.avatar_url} />
</svelte:head>

<Main>
	<HeroSection
		pictureSrc={user.avatar_url}
		title={user.username}
		roundedPicture
	/>

	<div class="flex gap-2">
		{#each ['tracks', 'playlists'] as kind (kind)}
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
		{/each}
	</div>

	<div class="flex flex-col gap-4">
		{#each results as result (result.id)}
			{#if selectedKind.current === 'tracks'}
				<TrackListing track={result as Track} />
			{:else if selectedKind.current === 'playlists'}
				<PlaylistListing playlist={result as Playlist} />
			{/if}
		{:else}
			{#if !isLoading}
				<span class="mt-4 text-zinc-100/25 text-lg">Nothing here...</span>
			{/if}
		{/each}
	</div>

	{#if isLoading}
		<Spinner />
	{:else if hasMoreResults}
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
