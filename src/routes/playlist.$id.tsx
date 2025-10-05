import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../lib/components/button";
import { HeroSection } from "../lib/components/hero-section";
import { TrackListing } from "../lib/components/listings/track-listing";
import { Main } from "../lib/components/main";
import { Spinner } from "../lib/components/spinner";
import {
	getPlaylistById,
	getTracksByIds,
} from "../lib/server-functions/get-by-id";

export const Route = createFileRoute("/playlist/$id")({
	component: RouteComponent,
	loader: ({ params }) => getPlaylistById({ data: Number(params.id) }),
	head: ({ loaderData }) => ({
		meta: [
			{ title: loaderData?.title ?? "Playlist" },
			{ name: "description", content: loaderData?.description ?? "" },
		],
	}),
});

function RouteComponent() {
	const playlist = Route.useLoaderData();

	// const [isLoading, setIsLoading] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	// const [hasMoreTracks, setHasMoreTracks] = useState(true);

	// async function doFetch() {
	// 	if (!playlist.tracks) return;

	// 	setIsLoading(true);

	// 	const { tracks: newTracks, hasMore } = await getTracksByIds({
	// 		data: {
	// 			ids: playlist.tracks.map((track) => track.id),
	// 			index: currentIndex,
	// 		},
	// 	});

	// 	setHasMoreTracks(hasMore);

	// 	setTracks((prevTracks) => [...prevTracks, ...newTracks]);

	// 	setIsLoading(false);
	// }

	const { data, isPending, refetch } = useQuery({
		queryKey: ["tracks", playlist.tracks, currentIndex],
		queryFn: () =>
			getTracksByIds({
				data: {
					ids: playlist.tracks?.map((track) => track.id) ?? [],
					index: currentIndex,
				},
			}),
		placeholderData: (previousData) => previousData,
	})

	return (
		<Main>
			<HeroSection
				pictureSrc={playlist.artwork_url}
				title={playlist.title}
				user={playlist.user}
			/>

			<h2 className="mt-4 font-medium text-2xl">
				{playlist.track_count} track{playlist.track_count === 1 ? "" : "s"}
			</h2>

			{data?.tracks.map((track) => (
				<TrackListing key={track.id} track={track} />
			))}

			{isPending ? (
				<Spinner />
			) : (
				data?.hasMore && (
					<Button
						className="mt-8 w-full"
						onClick={() => {
							setCurrentIndex((prev) => prev + 1);
							refetch()
						}}
					>
						Load more
					</Button>
				)
			)}
		</Main>
	)
}
