import { Link } from "@tanstack/react-router";
import type { Playlist } from "../../schemas/playlist";
import { ListingThumbnail } from "../ListingThumbnail";

export interface PlaylistListingProps {
	playlist: Playlist;
}

export function PlaylistListing({ playlist }: PlaylistListingProps) {
	return (
		<Link
			to={`/playlist/$id`}
			params={{ id: String(playlist.id) }}
			className="grid grid-cols-[auto_1fr] items-center gap-4 text-left transition-transform active:scale-95 active:opacity-50"
		>
			<ListingThumbnail
				src={playlist.artwork_url}
				alt={`Playlist picture of ${playlist.title}`}
			/>

			<div className="flex w-full min-w-0 flex-col">
				<div className="flex gap-2">
					<h3 className="truncate">{playlist.title}</h3>
					{playlist.is_album && (
						<div className="whitespace-nowrap rounded-full bg-zinc-700 px-2 py-0.5 text-sm text-zinc-400">
							Album
						</div>
					)}
				</div>
				<p className="truncate opacity-50">{playlist.user.username}</p>
			</div>
		</Link>
	);
}
