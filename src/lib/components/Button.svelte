<script module lang="ts">
	import type { WithElementRef } from '$lib/utils'
	import type { Snippet } from 'svelte'
	import type {
		HTMLAnchorAttributes,
		HTMLButtonAttributes,
	} from 'svelte/elements'

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: 'primary' | 'secondary'
			size?: 'icon'
			children?: Snippet
			href?: string
		}
</script>

<script lang="ts">
	import { cn } from 'cnfn'

	const {
		variant = 'primary',
		size,
		class: className,
		children,
		href,
		...rest
	}: ButtonProps = $props()
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	{...rest}
	class={cn(
		'flex items-center justify-center gap-2 rounded-full transition-transform active:scale-90 active:opacity-50',
		variant === 'primary' && 'bg-white text-zinc-800',
		variant === 'secondary' && 'bg-zinc-100/10',
		size === 'icon' ? 'size-10' : 'h-9 px-4',
		className,
	)}
>
	{@render children?.()}
</svelte:element>
