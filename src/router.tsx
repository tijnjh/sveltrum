import { routeTree } from './routeTree.gen'
import { Main } from '@/components/Main'
import { createRouter } from '@tanstack/react-router'

export function getRouter() {
	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultNotFoundComponent: () => <Main>404 - Not Found!</Main>,
	})

	return router
}
