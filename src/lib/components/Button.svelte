<script module lang="ts">
	import type { ButtonRootProps } from 'bits-ui'
	import { tv, type VariantProps } from 'tailwind-variants'

	export const buttonVariants = tv({
		slots: {
			base: [
				'flex items-center justify-center gap-2 rounded-full transition-transform ',
				'active:scale-90 active:opacity-50',
			],
		},
		variants: {
			variant: {
				primary: 'bg-white text-zinc-800',
				secondary: 'bg-zinc-100/10',
			},
			size: {
				default: 'px-4 py-2',
				icon: 'size-10',
			},
		},
		defaultVariants: {
			size: 'default',
			variant: 'primary',
		},
	})

	export type ButtonProps = ButtonRootProps &
		VariantProps<typeof buttonVariants>
</script>

<script lang="ts">
	import { Button } from 'bits-ui'
	import { cn } from 'cnfn'

	const {
		children,
		variant,
		size,
		class: className,
		...props
	}: ButtonProps = $props()

	const classes = $derived(buttonVariants({ variant, size }))
</script>

<Button.Root class={classes.base({ class: cn(className) })} {...props}>
	{@render children?.()}
</Button.Root>
