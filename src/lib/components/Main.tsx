import type { ReactNode } from "react";

export interface MainProps {
	children: ReactNode;
}

export function Main({ children }: MainProps) {
	return (
		<main className="mx-auto flex max-w-xl flex-col gap-4 p-4">{children}</main>
	);
}
