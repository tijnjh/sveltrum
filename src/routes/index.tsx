import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../lib/components/button";
import { PlaylistListing } from "../lib/components/listings/playlist-listing";
import { UserListing } from "../lib/components/listings/user-listing";
import { Main } from "../lib/components/main";
import { getSelections } from "../lib/server-functions/discovery";

export const Route = createFileRoute("/")({
	loader: () => getSelections(),

	component: () => {
		const selections = Route.useLoaderData();

		return (
			<Main>
				<div className="my-16 flex flex-col gap-4">
					<h1 className="mx-auto text-center font-mediums text-3xl">
						Sveltrum
					</h1>
					<div className="flex justify-center gap-4">
						<Button asChild>
							<a href="https://tijn.dev/sveltrum">View on GitHub</a>
						</Button>
					</div>
				</div>

				<h2 className="font-medium text-2xl">Trending playlists</h2>

				{selections.length ? (
					selections.map((selection) =>
						selection.items.collection.map((item) =>
							item.kind === "playlist" ? (
								<PlaylistListing key={item.id} playlist={item} />
							) : (
								item.kind === "user" && (
									<UserListing key={item.id} user={item} />
								)
							),
						),
					)
				) : (
					<span className="mt-4 text-lg text-zinc-100/25">Nothing here...</span>
				)}
			</Main>
		);
	},
});
