<script lang="ts" generics="T">
  import Spinner from "./Spinner.svelte";
  import { cn, type ClassValue } from "cnfn";
  import type { Snippet } from "svelte";
  import { fly } from "svelte/transition";

  const {
    isLoading,
    content,
    data,
    class: className,
  }: {
    isLoading: boolean;
    content: Snippet<[data: T]>;
    data: T;
    class?: ClassValue;
  } = $props();
</script>

{#if isLoading}
  <Spinner />
{:else}
  <div in:fly={{ y: 16 }} class={cn("flex flex-col gap-4", className)}>
    {@render content(data!)}
  </div>
{/if}
