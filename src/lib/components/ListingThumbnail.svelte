<script module lang='ts'>
  import type { ClassValue } from 'cnfn'

  export interface ListingThumbnailProps {
    src?: string | null
    alt: string
    class?: ClassValue
  }
</script>

<script lang='ts'>
  import { cn } from 'cnfn'

  const { src, alt, ...props }: ListingThumbnailProps = $props()

  let hasFailed = $state(false)
</script>

{#if src && !hasFailed}
  <img {src} {alt} class={cn('rounded size-12 aspect-square', props.class)} onerror={() => hasFailed = true}>
{:else}
  <div class='bg-zinc-700 rounded size-12 aspect-square'></div>
{/if}
