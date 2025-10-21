import { clsx, type ClassValue } from 'clsx'
import { IsInViewport, watch } from 'runed'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function whenInView(fn: VoidFunction) {
	return (node: HTMLElement) => {
		const inViewport = new IsInViewport(() => node)
		watch(() => inViewport.current, fn)
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any }
	? Omit<T, 'children'>
	: T
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
	ref?: U | null
}
