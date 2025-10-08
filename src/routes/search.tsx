import { createFileRoute } from "@tanstack/react-router";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import type { Playlist } from "../lib/schemas/playlist";
import type { Track } from "../lib/schemas/track";
import type { User } from "../lib/schemas/user";

export const Route = createFileRoute("/search")({
	component: RouteComponent,
});

function RouteComponent() {
	const [isLoading, setIsLoading] = useState(true);

	const [results, setResults] = useState<(Track | Playlist | User)[]>([]);

	const query = useQueryState("q", { history: "push", shallow: false });

	const selectedKind = useQueryState(
		"kind",
		parseAsString.withDefault("tracks").withOptions({
			history: "push",
			shallow: false,
		}),
	);

	useEffect(() => {
		if (query) doFetch();
	});

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

	return <div>Hello "/search"!</div>;
}
