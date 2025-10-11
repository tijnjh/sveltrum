import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { playlist } from "../schemas/playlist";
import { track } from "../schemas/track";
import { user } from "../schemas/user";
import { $api } from "./utils";

export const getSelections = createServerFn().handler(async () => {
	const res = await $api({
		path: "/mixed-selections",
		schema: z.object({
			collection: z
				.object({
					items: z.object({
						collection: z.union([playlist, user]).array(),
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
				collection: track.array(),
			}),
		}),
	);
