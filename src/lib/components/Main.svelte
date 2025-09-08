<script module lang='ts'>
  import type { Snippet } from 'svelte'

  export interface MainProps {
    children: Snippet
  }
</script>

<script lang='ts'>
  const { children }: MainProps = $props()
</script>

<main class='flex flex-col gap-4 mx-auto p-4 max-w-xl'>
  {@render children()}
</main>
