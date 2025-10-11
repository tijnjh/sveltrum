/// <reference types="vite/client" />

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { type ReactNode, StrictMode, useState } from "react";
import appCss from "../app.css?url";
import { Navigation } from "../lib/components/navigation";
import { NowPlayingView } from "../lib/components/now-playing-view";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),

	component: RootComponent,
});

function RootComponent() {
	const queryClient = new QueryClient();

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
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	const [showNowPlayingView, setShowNowPlayingView] = useState(false);

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<Navigation setShow={setShowNowPlayingView}>
					<div className="mb-64">{children}</div>
				</Navigation>

				<NowPlayingView
					show={showNowPlayingView}
					setShow={setShowNowPlayingView}
				/>

				<Scripts />
			</body>
		</html>
	);
}
