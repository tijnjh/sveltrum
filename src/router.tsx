import { Main } from './lib/components/Main'
import { routeTree } from './routeTree.gen'
import { createRouter } from '@tanstack/react-router'

export function getRouter() {
	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultNotFoundComponent: () => <Main>404 - Not Found!</Main>,
	})

	return router
}
