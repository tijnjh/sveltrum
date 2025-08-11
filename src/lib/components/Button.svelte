<script lang='ts'>
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes } from 'svelte/elements'
  import { cn } from 'cnfn'

  const { variant = 'primary', size, children, href, ...props }:
    Partial<HTMLAnchorAttributes & {
      variant: 'primary' | 'secondary'
      size?: 'icon'
      children: Snippet
      href: string
    }> = $props()

</script>

<svelte:element
  this={href ? 'a' : 'button'}
  href={href}
  {...props}
  class={cn(
    'flex justify-center items-center gap-2  active:opacity-50 rounded-full active:scale-90 transition-transform',
    variant === 'primary' && 'bg-white text-zinc-800',
    variant === 'secondary' && 'bg-zinc-100/10',
    size === 'icon' ? 'size-10' : 'h-10 px-4',
    props.class,
  )}
>
  {@render children?.()}
</svelte:element>
