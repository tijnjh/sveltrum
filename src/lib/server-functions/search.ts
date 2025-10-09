import { createServerFn } from "@tanstack/react-start";
import { type } from "arktype";
import { playlist } from "../schemas/playlist";
import { track } from "../schemas/track";
import { user } from "../schemas/user";
import { $api } from "./utils";

const searchSchema = type({
	query: "string",
	offset: "number?",
	limit: "number?",
	index: "number?",
});

export const searchTracks = createServerFn()
	.inputValidator(searchSchema)
	.handler(async ({ data: { query, offset, limit } }) => {
		const response = await $api({
			path: "/search/tracks",
			params: { q: query, limit, offset },
			schema: type({
				collection: track.array(),
			}),
		});
		return response.collection;
	});
// .handler(
// 	withPagination(({ data: { limit } }): "hi" => {
// 		return "hi";
// 	}),
// );

export const searchPlaylists = createServerFn()
	.inputValidator(searchSchema)
	.handler(async ({ data: { query, offset, limit } }) => {
		const response = await $api({
			path: "/search/playlists",
			params: { q: query, limit, offset },
			schema: type({
				collection: playlist.array(),
			}),
		});
		return response.collection;
	});

export const searchUsers = createServerFn()
	.inputValidator(searchSchema)
	.handler(async ({ data: { query, offset, limit } }) => {
		const response = await $api({
			path: "/search/users",
			params: { q: query, limit, offset },
			schema: type({
				collection: user.array(),
			}),
		});
		return response.collection;
	});
