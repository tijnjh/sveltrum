import { query } from '$app/server'
import { playlistSchema } from '$lib/schemas/playlist'
import { trackSchema } from '$lib/schemas/track'
import { userSchema } from '$lib/schemas/user'
import { $api, withPagination } from './utils'
import { z } from 'zod'

const searchSchema = z.object({
	query: z.string(),
	limit: z.number().optional(),
	index: z.number().optional(),
})

function baseSearch<S extends z.ZodType<T>, T = z.infer<S>>(
	kind: string,
	schema: S,
) {
	return query(
		searchSchema,
		withPagination(async ({ limit, offset, query }) => {
			const res = await $api({
				path: `/search/${kind}`,
				params: { q: query, limit, offset },
				schema: z.object({
					collection: schema.array(),
				}),
			})
			return res.collection
		}),
	)
}

export const searchTracks = baseSearch('tracks', trackSchema)
export const searchPlaylists = baseSearch('playlists', playlistSchema)
export const searchUsers = baseSearch('users', userSchema)
