import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { playlistSchema } from "../schemas/playlist";
import { $api } from "./utils";

export const getPlaylistById = createServerFn()
	.inputValidator(
		z.object({
			id: z.number(),
		}),
	)
	.handler(async ({ data: { id } }) =>
		$api({
			path: `/playlists/${id}`,
			schema: playlistSchema,
		}),
	);
