<script lang="ts">
	import type { User } from '$lib/schemas/user'
	import ListingThumbnail from '../ListingThumbnail.svelte'
	import { BadgeCheckIcon } from '@lucide/svelte'
	import { cn, type ClassValue } from 'cnfn'

	const {
		user,
		class: className,
	}: {
		user: User
		class?: ClassValue
	} = $props()
</script>

<a
	href="/{user.permalink}"
	class={cn(
		'grid grid-cols-[auto_1fr] items-center gap-4 text-left transition-transform active:scale-95 active:opacity-50',
		className,
	)}
>
	<ListingThumbnail
		src={user.avatar_url}
		alt="Profile picture of {user.username}"
		class="rounded-full"
	/>
	<div class="flex w-full min-w-0 flex-col">
		<div class="flex w-fit items-center gap-2">
			<h3 class="truncate">{user.username}</h3>
			{#if user.verified}
				<BadgeCheckIcon size={18} />
			{/if}
		</div>

		{#if user.full_name !== user.username}
			<p class="truncate opacity-50">{user.full_name}</p>
		{/if}
	</div>
</a>
