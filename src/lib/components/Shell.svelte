<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    left,
    right,
  }: {
    left: Snippet;
    right: Snippet;
  } = $props();
</script>

<div class="flex flex-col gap-4">
  {@render left()}
</div>

<div class="flex w-full grow flex-col gap-4 overflow-scroll">
  {@render right()}
</div>
