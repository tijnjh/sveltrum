import {
	QueryClient,
	QueryClientProvider,
	useQueryClient,
} from "@tanstack/react-query";
import "../app.css";
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

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
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<html lang="en">
				<head>
					<HeadContent />
				</head>
				<body className="bg-red-400 p-3 hover:bg-red-500">
					{children}
					<Scripts />
				</body>
			</html>
		</QueryClientProvider>
	);
}
