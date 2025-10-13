import { query } from '$app/server'
import { playlistSchema } from '$lib/schemas/playlist'
import { trackSchema } from '$lib/schemas/track'
import { $api, withPagination } from './utils'
import { z } from 'zod'

const getUserSchema = z.object({
	id: z.number(),
	size: z.number().optional(),
	index: z.number().optional(),
})

function baseGetUser<S extends z.ZodType<T>, T = z.infer<S>>(
	kind: string,
	schema: S,
) {
	return query(
		getUserSchema,
		withPagination(async ({ id, limit, offset }) => {
			const res = await $api({
				path: `/users/${id}/${kind}`,
				params: { limit, offset },
				schema: z.object({
					collection: schema.array(),
				}),
			})
			return res.collection
		}),
	)
}

export const getUserTracks = baseGetUser('tracks', trackSchema)
export const getUserPlaylists = baseGetUser('playlists', playlistSchema)
