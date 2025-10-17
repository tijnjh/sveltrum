<script module lang="ts">
	import type { User } from '$lib/schemas/user'

	export interface UserListingProps {
		user: User
	}
</script>

<script lang="ts">
	import GenericListing from './GenericListing.svelte'

	const { user }: UserListingProps = $props()
</script>

<GenericListing
	title={`${user.username}`}
	subtitle={user.permalink}
	thumbnail={{
		src: user.avatar_url,
		alt: `Profile picture of ${user.permalink}`,
	}}
	href={`/${user.permalink}`}
/>
