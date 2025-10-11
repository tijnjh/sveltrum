import { z } from "zod";
import { track } from "./track";
import { user } from "./user";

export const playlist = z.strictObject({
	artwork_url: z.string().nullable(),
	created_at: z.iso.datetime(),
	description: z.string().nullish(),
	duration: z.number(),
	embeddable_by: z.enum(["all", "none", "me"]).optional(),
	genre: z.string().nullish(),
	id: z.number(),
	kind: z.literal("playlist"),
	label_name: z.string().nullish(),
	last_modified: z.iso.datetime(),
	license: z.string().optional(),
	likes_count: z.number().nullable(),
	managed_by_feeds: z.boolean(),
	permalink: z.string(),
	permalink_url: z.url(),
	public: z.boolean(),
	purchase_title: z.string().nullish(),
	purchase_url: z.url().nullish(),
	release_date: z.string().nullable(),
	reposts_count: z.number(),
	secret_token: z.string().nullable(),
	sharing: z.enum(["public", "private"]),
	tag_list: z.string().optional(),
	title: z.string(),
	uri: z.url(),
	user_id: z.number(),
	is_album: z.boolean(),
	published_at: z.iso.datetime().nullable(),
	display_date: z.iso.datetime(),
	user,
	set_type: z.string(),
	track_count: z.number(),
	tracks: z
		.union([
			track,
			track.pick({
				id: true,
				kind: true,
				monetization_model: true,
				policy: true,
			}),
		])
		.array()
		.optional(),
});

export type Playlist = z.output<typeof playlist>;
