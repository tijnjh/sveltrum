<script lang="ts">
	import { page } from '$app/state'
	import { resolveTrack } from '$lib/api/track.remote'
	import HeroSection from '$lib/components/HeroSection.svelte'
	import Main from '$lib/components/Main.svelte'
	import Button from '$lib/components/ui/Button.svelte'

	const track = await resolveTrack({
		user: page.params.user!,
		track: page.params.track!,
	})
</script>

<Main>
	<HeroSection
		title={track.title}
		pictureSrc={track.artwork_url}
		user={track.user}
	/>

	<div>
		{#if track.genre}
			<Button>{track.genre}</Button>
		{/if}
	</div>
</Main>
