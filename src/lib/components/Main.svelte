<script lang='ts'>
  import type { Snippet } from 'svelte'

  const { children }: { children: Snippet } = $props()
</script>

<main class='flex flex-col gap-4 mx-auto p-4 max-w-xl'>
  {@render children()}
</main>
