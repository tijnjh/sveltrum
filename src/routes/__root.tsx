/// <reference types="vite/client" />
import appCss from '@/app.css?url'
import { Navigation } from '@/components/Navigation'
import { NowPlayingView } from '@/components/NowPlayingView'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from '@tanstack/react-router'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import { type ReactNode, StrictMode } from 'react'

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'TanStack Start Starter',
			},
		],
		links: [{ rel: 'stylesheet', href: appCss }],
	}),

	component: RootComponent,
})

function RootComponent() {
	const queryClient = new QueryClient()

	return (
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<NuqsAdapter>
					<RootDocument>
						<Outlet />
					</RootDocument>
				</NuqsAdapter>
			</QueryClientProvider>
		</StrictMode>
	)
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang='en'>
			<head>
				<HeadContent />
			</head>
			<body>
				<Navigation>
					<div className='mb-64'>{children}</div>
				</Navigation>

				<NowPlayingView />

				<Scripts />
			</body>
		</html>
	)
}
