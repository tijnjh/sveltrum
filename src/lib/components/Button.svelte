<script lang='ts'>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from 'cnfn'

  const { variant = 'primary', size, class: className, children, href, ...props }: Partial<HTMLButtonAttributes & {
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
    'flex justify-center items-center gap-2 active:opacity-50 rounded-full active:scale-90 transition-transform',
    variant === 'primary' && 'bg-white text-zinc-800',
    variant === 'secondary' && 'bg-zinc-100/10',
    size === 'icon' ? 'size-10' : 'h-9 px-4',
    className,
  )}
>
  {@render children?.()}
</svelte:element>
