import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { parseAsString, useQueryState } from "nuqs";
import { Fragment } from "react/jsx-runtime";
import { Button } from "../lib/components/button";
import { HeroSection } from "../lib/components/hero-section";
import { PlaylistListing } from "../lib/components/listings/playlist-listing";
import { TrackListing } from "../lib/components/listings/track-listing";
import { Main } from "../lib/components/main";
import { Spinner } from "../lib/components/spinner";
import { paginated_limit } from "../lib/constants";
import type { Playlist } from "../lib/schemas/playlist";
import type { Track } from "../lib/schemas/track";
import {
	getUserById,
	getUserPlaylists,
	getUserTracks,
} from "../lib/server-functions/user";

export const Route = createFileRoute("/user/$id")({
	loader: ({ params }) => getUserById({ data: { id: Number(params.id) } }),

	head: ({ loaderData }) => ({
		meta: [{ title: `${loaderData?.username} - sveltrum` }],
		links: [{ rel: "icon", href: loaderData?.avatar_url }],
	}),

	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	const user = Route.useLoaderData();

	const [selectedKind, setSelectedKind] = useQueryState(
		"kind",
		parseAsString.withDefault("tracks").withOptions({
			shallow: false,
			history: "push",
		}),
	);

	const { data, refetch, isLoading, hasNextPage, fetchNextPage } =
		useInfiniteQuery({
			queryKey: ["user", id, selectedKind],
			queryFn: async ({ pageParam = 0 }) => {
				const data = {
					id: Number(id),
					offset: pageParam * paginated_limit,
					limit: paginated_limit,
				};

				let results: (Track | Playlist)[] = [];

				switch (selectedKind) {
					case "playlists":
						results = await getUserPlaylists({ data });
						break;
					default:
						results = await getUserTracks({ data });
						break;
				}

				return results;
			},
			initialPageParam: 0,
			getNextPageParam: (lastPage, allPages) =>
				lastPage.length < paginated_limit ? allPages.length : undefined,
		});

	return (
		<Main>
			<HeroSection
				pictureSrc={user.avatar_url}
				title={user.username}
				roundedPicture
			/>

			<div className="flex gap-2">
				{["tracks", "playlists"].map((kind) => (
					<Button
						key={kind}
						variant={selectedKind === kind ? "primary" : "secondary"}
						className="capitalize"
						onClick={() => {
							setSelectedKind(kind);
							console.log("clicked");
							refetch();
						}}
					>
						{kind}
					</Button>
				))}
			</div>

			<div className="flex flex-col gap-4">
				{data?.pages.map((page) =>
					page?.map((result) => (
						<Fragment key={result.id}>
							{selectedKind === "tracks" ? (
								<TrackListing track={result as Track} />
							) : selectedKind === "playlists" ? (
								<PlaylistListing playlist={result as Playlist} />
							) : null}
						</Fragment>
					)),
				)}
			</div>

			{isLoading ? (
				<Spinner />
			) : (
				hasNextPage && (
					<Button
						className="mt-8 w-full"
						onClick={() => {
							fetchNextPage();
						}}
					>
						Load more
					</Button>
				)
			)}
		</Main>
	);
}
