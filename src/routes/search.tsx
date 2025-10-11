import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Fragment } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "../lib/components/Button";
import { PlaylistListing } from "../lib/components/listings/PlaylistListing";
import { TrackListing } from "../lib/components/listings/TrackListing";
import { UserListing } from "../lib/components/listings/UserListing";
import { Main } from "../lib/components/Main";
import { Spinner } from "../lib/components/Spinner";
import { paginated_limit } from "../lib/constants";
import type { Playlist } from "../lib/schemas/playlist";
import type { Track } from "../lib/schemas/track";
import type { User } from "../lib/schemas/user";
import {
	searchPlaylists,
	searchTracks,
	searchUsers,
} from "../lib/server-functions/search";

export const Route = createFileRoute("/search")({
	component: RouteComponent,
});

function RouteComponent() {
	const [searchQuery, setSearchQuery] = useQueryState("q", {
		history: "push",
		shallow: false,
	});

	const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

	const [selectedKind, setSelectedKind] = useQueryState(
		"kind",
		parseAsString.withDefault("tracks").withOptions({
			history: "push",
			shallow: false,
		}),
	);

	const { data, isLoading, fetchNextPage, hasNextPage, refetch } =
		useInfiniteQuery({
			queryKey: ["search", debouncedSearchQuery, selectedKind],
			queryFn: async ({ pageParam = 0 }) => {
				if (!searchQuery) return [];

				const data = {
					query: searchQuery,
					offset: pageParam * paginated_limit,
					limit: paginated_limit,
				};

				let results: (Track | Playlist | User)[] = [];

				switch (selectedKind) {
					case "playlists":
						results = await searchPlaylists({ data });
						break;

					case "users":
						results = await searchUsers({ data });
						break;
					default:
						results = await searchTracks({ data });
						break;
				}

				return results as (Track | Playlist | User)[];
			},
			initialPageParam: 0,
			getNextPageParam: (lastPage, allPages) =>
				lastPage.length < paginated_limit ? allPages.length : undefined,
		});

	return (
		<>
			<div className="sticky inset-x-0 top-0 z-50 flex w-full flex-col gap-4 bg-zinc-700/75 p-4 backdrop-blur-lg">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						refetch();
					}}
					className="mx-auto flex w-full max-w-xl gap-2"
				>
					<input
						type="text"
						value={searchQuery ?? ""}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="h-10 grow rounded-full bg-zinc-700 px-4"
						placeholder="Search"
					/>

					<Button type="submit" size="icon">
						<SearchIcon size={16} strokeWidth={3} />
					</Button>
				</form>

				<div className="mx-auto flex w-full max-w-xl gap-2">
					{["tracks", "playlists", "users"].map((kind) => (
						<Button
							key={kind}
							variant={selectedKind === kind ? "primary" : "secondary"}
							className="capitalize"
							onClick={() => {
								setSelectedKind(kind);
								refetch();
							}}
						>
							{kind}
						</Button>
					))}
				</div>
			</div>

			<Main>
				<div className="flex flex-col gap-4">
					{data?.pages.map((page) =>
						page.map((result) => (
							<Fragment key={result.id}>
								{selectedKind === "tracks" ? (
									<TrackListing track={result as Track} />
								) : selectedKind === "playlists" ? (
									<PlaylistListing playlist={result as Playlist} />
								) : selectedKind === "users" ? (
									<UserListing user={result as User} />
								) : null}
							</Fragment>
						)),
					)}
				</div>

				{isLoading ? (
					<Spinner />
				) : (
					searchQuery &&
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
		</>
	);
}
