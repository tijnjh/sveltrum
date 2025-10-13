import { query } from '$app/server'
import { paginatedSchema } from '$lib/schemas/paginated'
import { playlistSchema } from '$lib/schemas/playlist'
import { trackSchema } from '$lib/schemas/track'
import { userSchema } from '$lib/schemas/user'
import { $api } from './utils'
import { z } from 'zod'

export const searchTracks = query(
	paginatedSchema.extend({
		query: z.string(),
	}),
	async ({ query, offset, limit }) => {
		const response = await $api({
			path: '/search/tracks',
			params: { q: query, limit, offset },
			schema: z.object({
				collection: trackSchema.array(),
			}),
		})
		return response.collection
	},
)

export const searchPlaylists = query(
	paginatedSchema.extend({
		query: z.string(),
	}),
	async ({ query, offset, limit }) => {
		const response = await $api({
			path: '/search/playlists',
			params: { q: query, limit, offset },
			schema: z.object({
				collection: playlistSchema.array(),
			}),
		})
		return response.collection
	},
)

export const searchUsers = query(
	paginatedSchema.extend({
		query: z.string(),
	}),
	async ({ query, offset, limit }) => {
		const response = await $api({
			path: '/search/users',
			params: { q: query, limit, offset },
			schema: z.object({
				collection: userSchema.array(),
			}),
		})
		return response.collection
	},
)
