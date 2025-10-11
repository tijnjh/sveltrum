import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { playlistSchema } from "../schemas/playlist";
import { trackSchema } from "../schemas/track";
import { userSchema } from "../schemas/user";
import { $api } from "./utils";

export const getUserById = createServerFn()
	.inputValidator(
		z.object({
			id: z.number(),
		}),
	)
	.handler(async ({ data: { id } }) =>
		$api({
			path: `/users/${id}`,
			schema: userSchema,
		}),
	);

export const getUserTracks = createServerFn()
	.inputValidator(
		z.object({
			id: z.number(),
			offset: z.number().optional(),
			limit: z.number().optional(),
		}),
	)
	.handler(async ({ data: { id, offset, limit } }) => {
		const res = await $api({
			path: `/users/${id}/tracks`,
			params: { limit, offset },
			schema: z.object({
				collection: trackSchema.array(),
			}),
		});
		return res.collection;
	});

export const getUserPlaylists = createServerFn()
	.inputValidator(
		z.object({
			id: z.number(),
			offset: z.number().optional(),
			limit: z.number().optional(),
		}),
	)
	.handler(async ({ data: { id, offset, limit } }) => {
		const res = await $api({
			path: `/users/${id}/playlists`,
			params: { limit, offset },
			schema: z.object({
				collection: playlistSchema.array(),
			}),
		});
		return res.collection;
	});
