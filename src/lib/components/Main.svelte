<script module lang="ts">
	import type { Snippet } from 'svelte'

	export interface MainProps {
		children: Snippet
	}
</script>

<script lang="ts">
	const { children }: MainProps = $props()
</script>

<main class="mx-auto flex max-w-xl flex-col gap-4 p-4">
	{@render children()}
</main>
