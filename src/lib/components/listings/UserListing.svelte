<script lang="ts">
	import type { User } from '$lib/schemas/user'
	import GenericListing from './GenericListing.svelte'

	const { user }: { user: User } = $props()
</script>

<GenericListing
	title={`${user.username}`}
	subtitle={user.permalink}
	thumbnail={{
		src: user.avatar_url,
		alt: `Profile picture of ${user.permalink}`,
		class: 'rounded-full',
	}}
	href={`/${user.permalink}`}
/>
