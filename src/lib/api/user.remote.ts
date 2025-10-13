import { query } from '$app/server'
import { playlistSchema } from '$lib/schemas/playlist'
import { trackSchema } from '$lib/schemas/track'
import { userSchema } from '$lib/schemas/user'
import { $api } from './utils'
import { z } from 'zod'

export const getUserById = query(z.number(), (id) =>
	$api({
		path: `/users/${id}`,
		schema: userSchema,
	}),
)

export const getUserTracks = query(
	z.object({
		id: z.number(),
		offset: z.number().optional(),
		limit: z.number().optional(),
	}),
	async ({ id, offset, limit }) => {
		const res = await $api({
			path: `/users/${id}/tracks`,
			params: { limit, offset },
			schema: z.object({
				collection: trackSchema.array(),
			}),
		})
		return res.collection
	},
)

export const getUserPlaylists = query(
	z.object({
		id: z.number(),
		offset: z.number().optional(),
		limit: z.number().optional(),
	}),
	async ({ id, offset, limit }) => {
		const res = await $api({
			path: `/users/${id}/playlists`,
			params: { limit, offset },
			schema: z.object({
				collection: playlistSchema.array(),
			}),
		})
		return res.collection
	},
)
