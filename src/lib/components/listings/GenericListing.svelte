<script module lang="ts">
	import type { ListingThumbnailProps } from '../ListingThumbnail.svelte'
	import type { ButtonRootProps } from 'bits-ui'

	export type GenericListingProps = ButtonRootProps & {
		title: string
		badges?: string[]
		subtitle: string
		thumbnail: ListingThumbnailProps
		actions?: { label: string; onclick: VoidFunction }[]
	}
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import ListingThumbnail from '../ListingThumbnail.svelte'
	import { Badge } from '../ui/badge'
	import { EllipsisIcon } from '@lucide/svelte'
	import { Button as BitsUiButton } from 'bits-ui'

	const {
		title,
		badges,
		subtitle,
		thumbnail,
		actions,
		...props
	}: GenericListingProps = $props()
</script>

<div class="flex items-center gap-4 text-left">
	<BitsUiButton.Root
		{...props}
		class="flex w-full min-w-0 gap-4 text-left transition-transform active:scale-95 active:opacity-50"
	>
		<ListingThumbnail {...thumbnail} />

		<div class="flex flex-col truncate">
			<div class="flex gap-2">
				<h3 class="truncate">{title}</h3>

				{#each badges as badge (badge)}
					<Badge>
						{badge}
					</Badge>
				{/each}
			</div>
			<p class="truncate opacity-50">
				{subtitle}
			</p>
		</div>
	</BitsUiButton.Root>

	{#if actions}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button aria-label="More options" size="icon">
					<EllipsisIcon />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					{#each actions as action (action.label)}
						<DropdownMenu.Item onclick={action.onclick}>
							{action.label}
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/if}
</div>
