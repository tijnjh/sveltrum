<script module lang="ts">
	import type { User } from '$lib/schemas/user'

	export interface HeroSectionProps {
		pictureSrc?: string | null
		title: string
		user?: User
		roundedPicture?: boolean
	}
</script>

<script lang="ts">
	import UserListing from './listings/UserListing.svelte'
	import { cn } from 'cnfn'

	const {
		pictureSrc,
		title,
		user,
		roundedPicture = false,
	}: HeroSectionProps = $props()
</script>

{#if pictureSrc}
	<img
		src={pictureSrc.replace('large', 't500x500')}
		{@attach (node) => {
			node.onerror = () => {
				node.src = pictureSrc
			}
		}}
		class={cn(
			'mx-auto my-4 aspect-square w-full max-w-xs',
			roundedPicture ? 'rounded-full' : 'rounded-xl',
		)}
		alt={title}
	/>
{/if}

<h1 class="text-2xl font-medium">{title}</h1>

{#if user}
	<div class="mb-8 flex flex-col gap-4">
		<UserListing {user} />
	</div>
{/if}
