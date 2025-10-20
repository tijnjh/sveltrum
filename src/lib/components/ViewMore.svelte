<script lang="ts">
	import ListingThumbnail from './ListingThumbnail.svelte'
	import Button from './ui/Button.svelte'
	import { cn, type ClassValue } from 'cnfn'

	const {
		thumbnails = [],
		label,
		href,
		class: className,
	}: {
		thumbnails: (string | null | undefined)[]
		label: string
		href: string
		class?: ClassValue
	} = $props()
</script>

<Button
	{href}
	variant="secondary"
	class={cn('group relative justify-between py-3', className)}
>
	{label}

	<div
		class="isolate flex *:absolute *:bottom-2 *:[box-shadow:inset_0_0_10px_10px_rgb(0,0,0,1)] *:transition-[bottom,rotate] group-hover:*:bottom-4 group-hover:*:rotate-0"
	>
		{#if thumbnails.every((t) => t != null)}
			{@const [t1, t2, t3] = thumbnails}
			<ListingThumbnail src={t1} alt={label} class="right-25 z-[1] -rotate-5" />
			<ListingThumbnail src={t2} alt={label} class="right-15 z-[2]" />
			<ListingThumbnail src={t3} alt={label} class="right-5 z-[3] rotate-5" />
		{/if}
	</div>
</Button>
