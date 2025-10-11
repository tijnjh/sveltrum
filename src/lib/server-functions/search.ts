import { paginatedSchema } from '../schemas/paginated'
import { playlistSchema } from '../schemas/playlist'
import { trackSchema } from '../schemas/track'
import { userSchema } from '../schemas/user'
import { $api } from './utils'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export const searchTracks = createServerFn()
	.inputValidator(
		paginatedSchema.extend({
			query: z.string(),
		}),
	)
	.handler(async ({ data: { query, offset, limit } }) => {
		const response = await $api({
			path: '/search/tracks',
			params: { q: query, limit, offset },
			schema: z.object({
				collection: trackSchema.array(),
			}),
		})
		return response.collection
	})

export const searchPlaylists = createServerFn()
	.inputValidator(
		paginatedSchema.extend({
			query: z.string(),
		}),
	)
	.handler(async ({ data: { query, offset, limit } }) => {
		const response = await $api({
			path: '/search/playlists',
			params: { q: query, limit, offset },
			schema: z.object({
				collection: playlistSchema.array(),
			}),
		})
		return response.collection
	})

export const searchUsers = createServerFn()
	.inputValidator(
		paginatedSchema.extend({
			query: z.string(),
		}),
	)
	.handler(async ({ data: { query, offset, limit } }) => {
		const response = await $api({
			path: '/search/users',
			params: { q: query, limit, offset },
			schema: z.object({
				collection: userSchema.array(),
			}),
		})
		return response.collection
	})
