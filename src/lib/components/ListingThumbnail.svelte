<script module lang="ts">
  import type { ClassValue } from "cnfn";

  export interface ListingThumbnailProps {
    src?: string | null;
    alt: string;
    class?: ClassValue;
  }
</script>

<script lang="ts">
  import { cn } from "cnfn";

  const { src, alt, ...props }: ListingThumbnailProps = $props();

  let hasFailed = $state(false);
</script>

{#if src && !hasFailed}
  <img
    {src}
    {alt}
    class={cn("aspect-square size-12 rounded", props.class)}
    onerror={() => (hasFailed = true)}
  />
{:else}
  <div class="bg-mist-300-700 aspect-square size-12 rounded"></div>
{/if}
