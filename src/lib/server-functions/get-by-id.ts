import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { playlist } from "../schemas/playlist";
import { track } from "../schemas/track";
import { $api, chunked } from "./utils";

export const getTrackById = createServerFn()
	.inputValidator(type.number)
	.handler(async ({ data: id }) =>
		$api({
			path: `/tracks/${id}`,
			schema: track,
		}),
	);

export const getPlaylistById = createServerFn()
	.inputValidator(type.number)
	.handler(async ({ data: id }) =>
		$api({
			path: `/playlists/${id}`,
			schema: playlist,
		}),
	);

export const getTracksByIds = createServerFn()
	.inputValidator(
		type({
			ids: type("number").array(),
			size: "number?",
			index: "number?",
		}),
	)
	.handler(async ({ data: { ids, size = 32, index = 0 } }) => {
		const chunkedIds = chunked(ids, { size, index });

		if (!chunkedIds.length) {
			return { tracks: [], hasMore: false };
		}

		const tracks = await $api({
			path: `/tracks`,
			params: { ids: chunkedIds.join(",") },
			schema: track.array(),
		});

		return {
			tracks,
			hasMore: (index + 1) * size < ids.length,
		};
	});
