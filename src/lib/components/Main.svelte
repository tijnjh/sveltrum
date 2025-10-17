<script lang="ts">
	import { type ClassValue, cn } from 'cnfn'
	import type { Snippet } from 'svelte'

	const {
		children,
		left,
		right,
		class: className,
	}: {
		children?: Snippet
		left?: Snippet
		right?: Snippet
		class?: ClassValue
	} = $props()
</script>

<main
	class={cn(
		'mx-auto mt-16 flex max-w-5xl flex-col md:grid md:grid-cols-2 md:gap-4',
		className,
	)}
>
	{#if left}
		<div class="top-16 flex h-fit flex-col gap-4 p-4 md:sticky">
			{@render left()}
		</div>
	{/if}

	{#if right}
		<div class="mb-64 flex flex-col gap-4 p-4">
			{@render right()}
		</div>
	{/if}

	{#if !left && !right && children}
		<div class="mb-64 flex flex-col gap-4 p-4">
			{@render children()}
		</div>
	{/if}
</main>
