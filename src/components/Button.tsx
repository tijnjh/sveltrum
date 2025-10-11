import { Slot } from '@radix-ui/react-slot'
import { cn } from 'cnfn'
import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

export const buttonVariants = tv({
	slots: {
		base: 'flex items-center cursor-pointer justify-center gap-2 rounded-full transition-transform active:scale-90 active:opacity-50',
	},
	variants: {
		variant: {
			primary: 'bg-white text-zinc-800',
			secondary: 'bg-zinc-100/10',
		},
		size: {
			default: 'h-9 px-4',
			icon: 'size-10',
		},
	},
	defaultVariants: {
		variant: 'primary',
		size: 'default',
	},
})

export interface ButtonProps extends ComponentProps<'button'> {
	variant?: VariantProps<typeof buttonVariants>['variant']
	size?: VariantProps<typeof buttonVariants>['size']
	asChild?: boolean
}

export function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : 'button'

	const classes = buttonVariants({ variant, size, className })

	return <Comp data-slot='button' className={cn(classes.base())} {...props} />
}
