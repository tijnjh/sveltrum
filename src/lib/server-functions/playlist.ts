import { $api } from './utils'
import { playlistSchema } from '@/lib/schemas/playlist'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export const getPlaylistById = createServerFn()
	.inputValidator(
		z.object({
			id: z.number(),
		}),
	)
	.handler(({ data: { id } }) =>
		$api({
			path: `/playlists/${id}`,
			schema: playlistSchema,
		}),
	)
