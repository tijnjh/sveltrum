import { paginatedSchema } from '../schemas/paginated'
import { trackSchema } from '../schemas/track'
import { $api, chunked } from './utils'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export const getTrackById = createServerFn()
	.inputValidator(
		z.object({
			id: z.number(),
		}),
	)
	.handler(async ({ data: { id } }) =>
		$api({
			path: `/tracks/${id}`,
			schema: trackSchema,
		}),
	)

export const getTracksByIds = createServerFn()
	.inputValidator(
		z.object({
			ids: z.number().array(),
			size: z.number().optional(),
			index: z.number().optional(),
		}),
	)
	.handler(async ({ data: { ids, size = 32, index = 0 } }) => {
		const chunkedIds = chunked(ids, { size, index })

		if (!chunkedIds.length) {
			return { tracks: [], hasMore: false }
		}

		const tracks = await $api({
			path: `/tracks`,
			params: { ids: chunkedIds.join(',') },
			schema: trackSchema.array(),
		})

		return {
			tracks,
			hasMore: (index + 1) * size < ids.length,
		}
	})
