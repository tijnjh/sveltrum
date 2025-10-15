import { trackSchema } from './track'
import { userSchema } from './user'
import { z } from 'zod'

export const playlistSchema = z.strictObject({
	artwork_url: z.string().nullable(),
	created_at: z.iso.datetime(),
	description: z.string().nullish(),
	display_date: z.iso.datetime(),
	duration: z.number(),
	embeddable_by: z.enum(['all', 'none', 'me']).optional(),
	genre: z.string().nullish(),
	id: z.number(),
	is_album: z.boolean(),
	kind: z.literal('playlist'),
	label_name: z.string().nullish(),
	last_modified: z.iso.datetime(),
	license: z.string().optional(),
	likes_count: z.number().nullable(),
	managed_by_feeds: z.boolean(),
	permalink: z.string(),
	permalink_url: z.url(),
	public: z.boolean(),
	published_at: z.iso.datetime().nullable(),
	purchase_title: z.string().nullish(),
	purchase_url: z.url().nullish(),
	release_date: z.string().nullable(),
	reposts_count: z.number(),
	secret_token: z.string().nullable(),
	set_type: z.string(),
	sharing: z.enum(['public', 'private']),
	tag_list: z.string().optional(),
	title: z.string(),
	track_count: z.number(),
	tracks: z
		.union([
			trackSchema,
			trackSchema.pick({
				id: true,
				kind: true,
				monetization_model: true,
				policy: true,
			}),
		])
		.array()
		.optional(),
	uri: z.url(),
	user: userSchema,
	user_id: z.number(),
})

export type Playlist = z.output<typeof playlistSchema>
