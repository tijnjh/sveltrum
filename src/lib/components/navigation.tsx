import { Link, useLocation } from "@tanstack/react-router";
import { haptic } from "ios-haptics";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { PauseIcon, PlayIcon } from "lucide-react";
import type { ReactNode } from "react";
import { isPausedAtom, nowPlayingAtom, showNowPlayingViewAtom } from "../atoms";
import { Button } from "./button";
import { ListingThumbnail } from "./listing-thumbnail";

export function Navigation({ children }: { children: ReactNode }) {
	const location = useLocation();

	const navItems = [
		["/", "Home"],
		["/search", "Search"],
	] as const;

	function isActiveNavItem(to: string) {
		return location.pathname.replaceAll("/", "") === to.replaceAll("/", "");
	}

	return (
		<>
			{/* desktop */}
			<div className="grid grid-cols-[12rem_1fr] max-md:hidden">
				<div className="sticky top-0 z-50 flex h-svh flex-col gap-2 border-zinc-100/10 border-r bg-zinc-700/50 p-4">
					{navItems.map(([to, label]) => {
						const isCurrent = isActiveNavItem(to);

						return (
							<Button
								key={to}
								asChild
								variant={isCurrent ? "primary" : "secondary"}
							>
								<Link to={to}>{label}</Link>
							</Button>
						);
					})}
				</div>
				<div className="relative isolate">
					{children}
					<div className="fixed right-0 bottom-0 left-[12rem] z-50 bg-zinc-700/75 backdrop-blur-lg">
						<NowPlayingBar />
					</div>
				</div>
			</div>

			{/* mobile */}
			<div className="md:hidden">
				{children}

				<div className="fixed inset-x-0 bottom-0 z-50 bg-zinc-700/75 backdrop-blur-lg">
					<NowPlayingBar />

					<nav className="flex items-center justify-center gap-2 p-4">
						{navItems.map(([to, label]) => {
							const isCurrent = isActiveNavItem(to);

							return (
								<Button
									key={to}
									asChild
									variant={isCurrent ? "primary" : "secondary"}
								>
									<Link to={to}>{label}</Link>
								</Button>
							);
						})}
					</nav>
				</div>
			</div>
		</>
	);
}

function NowPlayingBar() {
	const nowPlaying = useAtomValue(nowPlayingAtom);
	const [isPaused, setIsPaused] = useAtom(isPausedAtom);
	const showNowPlayingView = useSetAtom(showNowPlayingViewAtom);

	if (!nowPlaying) return;

	const StatusIcon = isPaused ? PlayIcon : PauseIcon;

	return (
		<div className="max-md:border-zinc-100/10 max-md:border-b">
			<div className="mx-auto grid max-w-xl grid-cols-[1fr_auto] items-center gap-4 p-4">
				<button
					type="button"
					onClick={() => showNowPlayingView(true)}
					className="flex gap-4 truncate text-left"
				>
					<ListingThumbnail src={nowPlaying.artwork_url} alt="" />

					<div className="flex w-full min-w-0 flex-col">
						<h3 className="truncate">{nowPlaying.title}</h3>
						<p className="truncate opacity-50">{nowPlaying.user.username}</p>
					</div>
				</button>

				<Button
					size="icon"
					variant="secondary"
					onClick={() => {
						haptic();
						setIsPaused(!isPaused);
					}}
				>
					{isPaused}
					<StatusIcon fill="currentColor" className="opacity-50" size={16} />
				</Button>
			</div>
		</div>
	);
}
