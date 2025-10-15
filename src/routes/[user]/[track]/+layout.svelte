<script module lang="ts">
	import type { Track } from '$lib/schemas/track'

	let track = $state<Track>()!

	// theres probably a better way to do this

	export function getTrack() {
		return track
	}
</script>

<script lang="ts">
	import { page } from '$app/state'
	import { resolveTrack } from '$lib/api/track.remote'
	import HeroSection from '$lib/components/HeroSection.svelte'
	import Main from '$lib/components/Main.svelte'

	// import Button from '$lib/components/ui/Button.svelte'

	const { children } = $props()

	track = await resolveTrack({
		user: page.params.user!,
		track: page.params.track!,
	})
</script>

<Main>
	{#snippet left()}
		<HeroSection
			title={track.title}
			pictureSrc={track.artwork_url}
			user={track.user}
		/>

		<!-- <Button href="/{track.user.permalink}/{track.permalink}/sets">
			In playlists
		</Button> -->
	{/snippet}

	{#snippet right()}
		{@render children()}
	{/snippet}
</Main>
