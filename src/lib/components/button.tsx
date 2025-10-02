import { cn } from "cnfn";
import type { ComponentProps, ReactNode } from "react";

export type ButtonProps = ComponentProps<"button"> &
	ComponentProps<"a"> & {
		variant?: "primary" | "secondary";
		size?: "icon";
		children?: ReactNode;
		href?: string;
	};

export function Button({
	variant = "primary",
	size,
	className,
	children,
	href,
	...rest
}: ButtonProps) {
	const Tag = href ? "a" : "button";

	return (
		<Tag
			href={href}
			{...rest}
			className={cn(
				"flex items-center justify-center gap-2 rounded-full transition-transform active:scale-90 active:opacity-50",
				variant === "primary" && "bg-white text-zinc-800",
				variant === "secondary" && "bg-zinc-100/10",
				size === "icon" ? "size-10" : "h-9 px-4",
				className,
			)}
		>
			{children}
		</Tag>
	);
}
