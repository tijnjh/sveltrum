import { IsInViewport, watch } from 'runed'

export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
	ref?: U | null
}

export function whenInView(fn: VoidFunction) {
	return (node: HTMLElement) => {
		const inViewport = new IsInViewport(() => node)
		watch(() => inViewport.current, fn)
	}
}
