<script lang='ts'>
  import type { Snippet } from 'svelte'

  const { children }: { children: Snippet } = $props()
</script>

<main class='p-4 max-w-xl mx-auto flex flex-col gap-4'>
  {@render children()}
</main>
