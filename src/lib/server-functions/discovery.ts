import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { playlistSchema } from "../schemas/playlist";
import { trackSchema } from "../schemas/track";
import { userSchema } from "../schemas/user";
import { $api } from "./utils";

export const getSelections = createServerFn().handler(async () => {
	const res = await $api({
		path: "/mixed-selections",
		schema: z.object({
			collection: z
				.object({
					items: z.object({
						collection: z.union([playlistSchema, userSchema]).array(),
					}),
				})
				.array(),
		}),
	});

	return res.collection;
});

export const getRelatedTracks = createServerFn()
	.inputValidator(z.number())
	.handler(async ({ data: id }) =>
		$api({
			path: `/tracks/${id}/related`,
			schema: z.object({
				collection: trackSchema.array(),
			}),
		}),
	);
