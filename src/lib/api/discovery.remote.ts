import { query } from '$app/server'
import { playlistSchema } from '$lib/schemas/playlist'
import { trackSchema } from '$lib/schemas/track'
import { userSchema } from '$lib/schemas/user'
import { $api } from './utils'
import { z } from 'zod'

export const getSelections = query(async () => {
	const res = await $api({
		path: '/mixed-selections',
		schema: z.object({
			collection: z
				.object({
					items: z.object({
						collection: z.union([playlistSchema, userSchema]).array(),
					}),
				})
				.array(),
		}),
	})

	return res.collection
})

export const getRelatedTracks = query(z.number(), (id) =>
	$api({
		path: `/tracks/${id}/related`,
		schema: z.object({
			collection: trackSchema.array(),
		}),
	}),
)
