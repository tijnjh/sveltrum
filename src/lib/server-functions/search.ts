import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { playlist } from "../schemas/playlist";
import { track } from "../schemas/track";
import { user } from "../schemas/user";
import { $api } from "./utils";

const searchSchema = z.object({
	query: z.string(),
	offset: z.number().optional(),
	limit: z.number().optional(),
	index: z.number().optional(),
});

export const searchTracks = createServerFn()
	.inputValidator(searchSchema)
	.handler(async ({ data: { query, offset, limit } }) => {
		const response = await $api({
			path: "/search/tracks",
			params: { q: query, limit, offset },
			schema: z.object({
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
			schema: z.object({
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
			schema: z.object({
				collection: user.array(),
			}),
		});
		return response.collection;
	});
