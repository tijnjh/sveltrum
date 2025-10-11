import { $api } from './utils'
import { playlistSchema } from '@/lib/schemas/playlist'
import { trackSchema } from '@/lib/schemas/track'
import { userSchema } from '@/lib/schemas/user'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export const getSelections = createServerFn().handler(async () => {
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

export const getRelatedTracks = createServerFn()
	.inputValidator(z.number())
	.handler(({ data: id }) =>
		$api({
			path: `/tracks/${id}/related`,
			schema: z.object({
				collection: trackSchema.array(),
			}),
		}),
	)
