import { isServer } from "@tanstack/react-query";
import { cn } from "cnfn";
import Hls from "hls.js";
import { useAtom, useAtomValue } from "jotai";
import { ChevronDownIcon } from "lucide-react";
import { type Dispatch, useEffect, useRef } from "react";
import { isPausedAtom, nowPlayingAtom } from "../atoms";
import type { Track } from "../schemas/track";
import { getTrackSource } from "../server-functions/hls";
import { UserListing } from "./listings/user-listing";

function applySource({
	track,
	element,
}: {
	track: Track;
	element: HTMLAudioElement;
}) {
	getTrackSource({ data: track.id }).then((url) => {
		if (!Hls.isSupported()) {
			throw new Error("hls is not supported");
		}

		const hls = new Hls();
		hls.loadSource(url);
		hls.attachMedia(element);
	});
}

export interface NowPlayingViewProps {
	show: boolean;
	setShow: Dispatch<boolean>;
}

export function NowPlayingView({ show, setShow }: NowPlayingViewProps) {
	const nowPlaying = useAtomValue(nowPlayingAtom);
	const [isPaused, setIsPaused] = useAtom(isPausedAtom);

	useEffect(() => {
		if (nowPlaying) {
			if ("mediaSession" in navigator) {
				navigator.mediaSession.metadata = new MediaMetadata({
					title: nowPlaying.title,
					artist: nowPlaying.user.username,
					album: "Sveltrum",
					artwork: [
						{
							src: nowPlaying.artwork_url?.replace("large", "t500x500") ?? "",
							sizes: "500x500",
							type: "image/jpeg",
						},
					],
				});
			}
		}
	});

	if (!isServer) {
		window.onkeydown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				show = false;
			}
		};
	}

	const audioRef = useRef<HTMLAudioElement>(null);

	useEffect(() => {
		if (!nowPlaying) return;
		if (!audioRef.current) return;

		// we dont want to reapply the source if it already has one
		if (audioRef.current.src) return;

		setIsPaused(true);

		applySource({ track: nowPlaying, element: audioRef.current });
	}, [nowPlaying, setIsPaused]);

	useEffect(() => {
		if (!audioRef.current) return;

		if (isPaused) {
			audioRef.current.pause();
		} else {
			audioRef.current.play().catch(() => {
				setIsPaused(true);
			});
		}
	}, [isPaused, setIsPaused]);

	if (!nowPlaying) return;

	const track = nowPlaying;

	return (
		<div
			className={cn(
				"fixed inset-x-0 z-50 grid h-full grid-cols-1 place-items-center gap-x-8 overflow-y-scroll bg-zinc-700/75 p-4 backdrop-blur-lg transition-[top] duration-300 md:grid-cols-2",
				show ? "top-0" : "top-[100%]",
			)}
		>
			<button
				type="button"
				onClick={() => setShow(false)}
				className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-zinc-100/10 transition-transform active:scale-90 active:opacity-50"
			>
				<ChevronDownIcon size={16} strokeWidth={3} />
			</button>

			<div className="flex w-full flex-col gap-4 max-md:mt-16 md:max-w-sm">
				{track.artwork_url ? (
					<img
						src={track.artwork_url.replace("large", "t500x500")}
						className="mt-12 aspect-square w-full rounded-xl"
						alt=""
					/>
				) : (
					<div className="mt-12 aspect-square w-full rounded-xl bg-zinc-700 md:max-w-md" />
				)}

				<hgroup>
					<h1 className="font-medium text-2xl">{track.title}</h1>
					<UserListing user={track.user} className="mt-4" />
				</hgroup>

				{/** biome-ignore lint/a11y/useMediaCaption: dont care lmao */}
				<audio
					key={nowPlaying.id}
					className="h-10"
					controls
					onPause={() => setIsPaused(true)}
					onPlay={() => setIsPaused(false)}
					ref={audioRef}
				/>
			</div>
		</div>
	);
}
