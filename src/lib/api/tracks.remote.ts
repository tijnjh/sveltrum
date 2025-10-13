import { query } from '$app/server'
import { trackSchema } from '$lib/schemas/track'
import { $api, chunked } from './utils'
import { z } from 'zod'

export const getTrackById = query(z.number(), (id) =>
	$api({
		path: `/tracks/${id}`,
		schema: trackSchema,
	}),
)

export const getTracksByIds = query(
	z.object({
		ids: z.number().array(),
		size: z.number().optional(),
		index: z.number().optional(),
	}),
	async ({ ids, size = 32, index = 0 }) => {
		const chunkedIds = chunked(ids, { size, index })

		if (!chunkedIds.length) {
			return { tracks: [], hasMore: false }
		}

		const tracks = await $api({
			path: `/tracks`,
			params: { ids: chunkedIds.join(',') },
			schema: z.array(trackSchema),
		})

		return {
			tracks,
			hasMore: (index + 1) * size < ids.length,
		}
	},
)
