import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { Fragment } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "../lib/components/button";
import { PlaylistListing } from "../lib/components/listings/playlist-listing";
import { TrackListing } from "../lib/components/listings/track-listing";
import { UserListing } from "../lib/components/listings/user-listing";
import { Main } from "../lib/components/main";
import { Spinner } from "../lib/components/spinner";
import type { Playlist } from "../lib/schemas/playlist";
import type { Track } from "../lib/schemas/track";
import type { User } from "../lib/schemas/user";
import {
	searchPlaylists,
	searchTracks,
	searchUsers,
} from "../lib/server-functions/search";

export const Route = createFileRoute("/search")({
	component: () => {
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

		function searchFor(kind: string) {
			switch (kind) {
				case "playlists":
					return searchPlaylists;
				case "users":
					return searchUsers;
				default:
					return searchTracks;
			}
		}

		const { data, isPending, fetchNextPage, hasNextPage, refetch } =
			useInfiniteQuery({
				queryKey: [debouncedSearchQuery, selectedKind],
				queryFn: async ({ pageParam = 0 }) => {
					if (!searchQuery) return [];

					const results = await searchFor(selectedKind ?? "tracks")({
						data: {
							query: searchQuery,
							index: pageParam,
							offset: pageParam * 25,
							limit: 25,
						},
					});

					return results as (Track | Playlist | User)[];
				},
				initialPageParam: 0,
				getNextPageParam: (lastPage, allPages) =>
					lastPage.length < 25 ? allPages.length : undefined,
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

					{isPending ? (
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
	},
});
