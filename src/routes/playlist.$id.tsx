import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
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
	loader: ({ params }) => getPlaylistById({ data: Number(params.id) }),

	head: ({ loaderData }) => ({
		meta: [
			{ title: loaderData?.title ?? "Playlist" },
			{ name: "description", content: loaderData?.description ?? "" },
		],
	}),

	component: () => {
		const playlist = Route.useLoaderData();

		const { data, isPending, fetchNextPage, hasNextPage } = useInfiniteQuery({
			queryKey: ["tracks", playlist.tracks],
			queryFn: ({ pageParam = 0 }) =>
				getTracksByIds({
					data: {
						ids: playlist.tracks?.map((track) => track.id) ?? [],
						index: pageParam,
					},
				}),
			initialPageParam: 0,
			getNextPageParam: (lastPage, allPages) =>
				lastPage.hasMore ? allPages.length : undefined,
		});

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

				{data?.pages.map((page) =>
					page.tracks.map((track) => (
						<TrackListing key={track.id} track={track} />
					)),
				)}

				{isPending ? (
					<Spinner />
				) : (
					hasNextPage && (
						<Button className="mt-8 w-full" onClick={() => fetchNextPage()}>
							Load more
						</Button>
					)
				)}
			</Main>
		);
	},
});
