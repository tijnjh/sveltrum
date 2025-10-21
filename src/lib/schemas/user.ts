import * as v from 'valibot'

export const User = v.strictObject({
	avatar_url: v.pipe(v.string(), v.url()),
	badges: v.strictObject({
		pro: v.boolean(),
		creator_mid_tier: v.boolean(),
		pro_unlimited: v.boolean(),
		verified: v.boolean(),
	}),
	city: v.nullable(v.string()),
	comments_count: v.optional(v.number()),
	country_code: v.nullable(v.string()),
	created_at: v.optional(v.pipe(v.string(), v.isoTimestamp())),
	creator_subscription: v.optional(
		v.strictObject({
			product: v.strictObject({
				id: v.string(),
			}),
		}),
	),
	creator_subscriptions: v.optional(
		v.array(
			v.strictObject({
				product: v.strictObject({
					id: v.string(),
				}),
			}),
		),
	),
	date_of_birth: v.optional(v.nullable(v.string())),
	description: v.optional(v.nullable(v.string())),
	first_name: v.string(),
	followers_count: v.number(),
	followings_count: v.optional(v.number()),
	full_name: v.string(),
	groups_count: v.optional(v.number()),
	id: v.number(),
	kind: v.literal('user'),
	last_modified: v.pipe(v.string(), v.isoTimestamp()),
	last_name: v.string(),
	likes_count: v.optional(v.number()),
	permalink: v.string(),
	permalink_url: v.pipe(v.string(), v.url()),
	playlist_count: v.optional(v.number()),
	playlist_likes_count: v.optional(v.number()),
	reposts_count: v.optional(v.nullable(v.number())),
	station_permalink: v.optional(v.string()),
	station_urn: v.optional(v.string()),
	track_count: v.optional(v.number()),
	uri: v.pipe(v.string(), v.url()),
	urn: v.string(),
	username: v.string(),
	verified: v.boolean(),
	visuals: v.nullish(
		v.strictObject({
			urn: v.string(),
			enabled: v.boolean(),
			visuals: v.array(
				v.strictObject({
					urn: v.string(),
					entry_time: v.number(),
					visual_url: v.pipe(v.string(), v.url()),
					link: v.optional(v.string()),
				}),
			),
			tracking: v.null(),
		}),
	),
})

export type User = v.InferOutput<typeof User>
