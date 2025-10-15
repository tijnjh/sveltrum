import { query } from '$app/server'
import { paginated_limit } from '$lib/constants'
import { trackSchema } from '$lib/schemas/track'
import { $api, getPermalinkPath } from './utils'
import { z } from 'zod'

export const resolveTrack = query(
	z.object({
		user: z.string(),
		track: z.string(),
	}),
	({ user, track }) =>
		$api({
			path: getPermalinkPath(user, track),
			schema: trackSchema,
		}),
)

export const getTrackById = query(z.number(), (id) =>
	$api({
		path: `/tracks/${id}`,
		schema: trackSchema,
	}),
)

export const getTracksByIds = query(z.array(z.number()), (ids) =>
	$api({
		path: `/tracks`,
		params: {
			ids: ids.join(','),
			limit: paginated_limit,
		},
		schema: z.array(trackSchema),
	}),
)
