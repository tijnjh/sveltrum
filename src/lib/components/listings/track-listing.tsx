import { useSetAtom } from "jotai";
import { isPausedAtom, nowPlayingAtom } from "../../atoms";
import type { Track } from "../../schemas/track";
import { ListingThumbnail } from "../listing-thumbnail";

export interface TrackListingProps {
	track: Track;
	inAlbum?: boolean;
}

export function TrackListing({ track, inAlbum = false }: TrackListingProps) {
	const setIsPaused = useSetAtom(isPausedAtom);
	const setNowPlaying = useSetAtom(nowPlayingAtom);

	return (
		<button
			type="button"
			onClick={() => {
				setNowPlaying(track);

				setTimeout(() => {
					setIsPaused(false);
				}, 100);
			}}
			className="grid grid-cols-[auto_1fr] items-center gap-4 text-left transition-transform active:scale-95 active:opacity-50"
		>
			{!inAlbum && (
				<ListingThumbnail
					src={track.artwork_url}
					alt={`album cover of ${track.title}`}
				/>
			)}

			<div className="flex w-full min-w-0 flex-col">
				<div className="flex gap-2">
					<h3 className="truncate">{track.title}</h3>

					{track.policy === "SNIP" && (
						<div className="whitespace-nowrap rounded-full bg-zinc-700 px-2 py-0.5 text-sm text-zinc-400">
							30s only
						</div>
					)}
				</div>
				<p className="truncate opacity-50">
					{inAlbum
						? `${track.playback_count?.toLocaleString()} plays`
						: track.user?.username}
				</p>
			</div>
		</button>
	);
}
