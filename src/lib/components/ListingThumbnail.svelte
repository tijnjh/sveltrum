<script lang='ts'>
  import type { ClassValue } from 'cnfn'
  import { cn } from 'cnfn'

  const { src, alt, ...props }: { src: string | null, alt: string, class?: ClassValue } = $props()

  let hasFailed = $state(false)
</script>

{#if src && !hasFailed}
  <img {src} alt={alt} class={cn('rounded size-12 aspect-square', props.class)} onerror={() => hasFailed = true}>
{:else}
  <div class='rounded size-12 aspect-square bg-zinc-700'></div>
{/if}
