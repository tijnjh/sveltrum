import { createFileRoute } from "@tanstack/react-router";
import { scan } from "react-scan";
import { Button } from "../lib/components/button";
import { PlaylistListing } from "../lib/components/listings/playlist-listing";
import { Main } from "../lib/components/main";
import { getSelections } from "../lib/server-functions/discovery";

scan({ enabled: true });

export const Route = createFileRoute("/")({
	component: RouteComponent,
	loader: () => getSelections(),
});

function RouteComponent() {
	const selections = Route.useLoaderData();

	return (
		<Main>
			<div className="my-16 flex flex-col gap-4">
				<h1 className="mx-auto text-center font-mediums text-3xl">Sveltrum</h1>
				<div className="flex justify-center gap-4">
					<Button asChild>
						<a href="https://tijn.dev/sveltrum">View on GitHub</a>
					</Button>
				</div>
			</div>

			<h2 className="font-medium text-2xl">Trending playlists</h2>

			{selections.length ? (
				selections.map((selection) =>
					selection.items.collection.map((playlist) => (
						<PlaylistListing key={playlist.id} playlist={playlist} />
					)),
				)
			) : (
				<span className="mt-4 text-lg text-zinc-100/25">Nothing here...</span>
			)}
		</Main>
	);
}
