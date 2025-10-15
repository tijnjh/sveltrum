import { query } from '$app/server'
import { collectionSchema } from '$lib/schemas/collection'
import { playlistSchema } from '$lib/schemas/playlist'
import { trackSchema } from '$lib/schemas/track'
import { userSchema } from '$lib/schemas/user'
import { $api, getPermalinkPath } from './utils'
import { z } from 'zod'

export const resolveUser = query(z.string(), (user) =>
	$api({
		path: getPermalinkPath(user),
		schema: userSchema,
	}),
)

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
			schema: collectionSchema(trackSchema),
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
			schema: collectionSchema(playlistSchema),
		})
		return res.collection
	},
)
