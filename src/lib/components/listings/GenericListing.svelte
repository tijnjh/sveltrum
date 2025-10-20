<script module lang="ts">
	import type { ListingThumbnailProps } from '../ListingThumbnail.svelte'
	import type { ButtonRootProps } from 'bits-ui'
	import type { MergeExclusive } from 'type-fest'

	export type GenericListingProps = ButtonRootProps & {
		title: string
		badges?: string[]
		subtitle: string
		thumbnail: ListingThumbnailProps
		actions?: MergeExclusive<
			{ label: string; onclick: VoidFunction },
			{ label: string; href: string }
		>[]
	}
</script>

<script lang="ts">
	import ListingThumbnail from '../ListingThumbnail.svelte'
	import Button from '../ui/Button.svelte'
	import { EllipsisIcon } from '@lucide/svelte'
	import { DropdownMenu, Button as BitsUiButton } from 'bits-ui'
	import { scale } from 'svelte/transition'

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
					<div
						class="rounded-full bg-zinc-700 px-2 py-0.5 text-sm whitespace-nowrap text-zinc-400"
					>
						{badge}
					</div>
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
				<Button
					variant="secondary"
					icon={EllipsisIcon}
					aria-label="More options"
					size="icon"
				/>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" forceMount>
				{#snippet child({ props, open, wrapperProps })}
					<div {...wrapperProps}>
						{#if open}
							<div
								{...props}
								class="z-[1000] flex origin-top-right flex-col gap-2 pt-2"
								transition:scale={{ start: 0.9, duration: 150 }}
							>
								{#each actions as action (action.label)}
									<Button href={action.href} onclick={action.onclick}>
										{action.label}
									</Button>
								{/each}
							</div>
						{/if}
					</div>
				{/snippet}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/if}
</div>
