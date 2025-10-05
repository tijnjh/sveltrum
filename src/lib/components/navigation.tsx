import { Link, useLocation } from "@tanstack/react-router";
import { haptic } from "ios-haptics";
import { useAtom, useAtomValue } from "jotai";
import { PauseIcon, PlayIcon } from "lucide-react";
import type { Dispatch, ReactNode } from "react";
import { isPausedAtom, nowPlayingAtom } from "../atoms";
import { useMediaQuery } from "../utils/reactive-media-query";
import { Button } from "./button";
import { ListingThumbnail } from "./listing-thumbnail";

export interface NavigationProps {
	setShow: Dispatch<boolean>;
	children: ReactNode;
}

export function Navigation({ setShow, children }: NavigationProps) {
	const location = useLocation();

	const md = useMediaQuery("width > 768px");

	const navItems = [
		["/", "Home"],
		["/search", "Search"],
	] as const;

	if (md.matches) {
		return (
			<div className="grid grid-cols-[12rem_1fr]">
				<div className="sticky top-0 z-50 flex h-svh flex-col gap-2 border-zinc-100/10 border-r bg-zinc-700/50 p-4">
					{navItems.map(([to, label]) => {
						const isCurrent = location.pathname === `/${to.replace("/", "")}`;

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
						<NowPlayingBar setShow={setShow} />
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<>
				{children}

				<div className="fixed inset-x-0 bottom-0 z-50 bg-zinc-700/75 backdrop-blur-lg">
					<NowPlayingBar setShow={setShow} />

					<nav className="flex items-center justify-center gap-2 p-4">
						{navItems.map(([to, label]) => {
							const isCurrent = location.pathname === `/${to.replace("/", "")}`;

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
			</>
		);
	}
}

function NowPlayingBar({ setShow }: { setShow: Dispatch<boolean> }) {
	const nowPlaying = useAtomValue(nowPlayingAtom);
	const [isPaused, setIsPaused] = useAtom(isPausedAtom);

	if (!nowPlaying) return;

	const StatusIcon = isPaused ? PlayIcon : PauseIcon;

	return (
		<div className="max-md:border-zinc-100/10 max-md:border-b">
			<div className="mx-auto grid max-w-xl grid-cols-[1fr_auto] items-center gap-4 p-4">
				<button
					type="button"
					onClick={() => setShow(true)}
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
