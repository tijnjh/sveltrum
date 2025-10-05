import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { playlist } from "../schemas/playlist";
import { track } from "../schemas/track";
import { $api } from "./utils";

export const getSelections = createServerFn().handler(async () => {
	const res = await $api({
		path: "/mixed-selections",
		schema: type({
			collection: type({
				items: {
					collection: playlist.array(),
				},
			}).array(),
		}),
	});

	return res.collection;
});

export const getRelatedTracks = createServerFn()
	.inputValidator(type.number)
	.handler(async ({ data: id }) =>
		$api({
			path: `/tracks/${id}/related`,
			schema: type({
				collection: track.array(),
			}),
		}),
	);
