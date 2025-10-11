import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../lib/components/Button";
import { HeroSection } from "../lib/components/HeroSection";
import { TrackListing } from "../lib/components/listings/TrackListing";
import { Main } from "../lib/components/Main";
import { Spinner } from "../lib/components/Spinner";
import { getPlaylistById } from "../lib/server-functions/playlist";
import { getTracksByIds } from "../lib/server-functions/track";

export const Route = createFileRoute("/playlist/$id")({
	loader: ({ params }) => getPlaylistById({ data: { id: Number(params.id) } }),

	head: ({ loaderData }) => ({
		meta: [{ title: `${loaderData?.title} - sveltrum` }],
		links: [{ rel: "icon", href: loaderData?.artwork_url ?? "" }],
	}),

	component: RouteComponent,
});

function RouteComponent() {
	const playlist = Route.useLoaderData();

	const { data, isError, isLoading, fetchNextPage, hasNextPage } =
		useInfiniteQuery({
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

	if (isError) {
		return (
			<Main>
				<span className="font-medium text-xl text-zinc-100/25">
					Failed to load playlist
				</span>
			</Main>
		);
	}

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

			{isLoading ? (
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
}
