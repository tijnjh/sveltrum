import { query } from '$app/server'
import { paginated_limit } from '$lib/constants'
import { Track } from '$lib/schemas/track'
import { $api, getPermalinkPath } from './utils'
import * as v from 'valibot'

export const resolveTrack = query(
	v.object({
		user: v.string(),
		track: v.string(),
	}),
	({ user, track }) =>
		$api({
			path: getPermalinkPath(user, track),
			schema: Track,
		}),
)

export const getTrackById = query(v.number(), (id) =>
	$api({
		path: `/tracks/${id}`,
		schema: Track,
	}),
)

export const getTracksByIds = query(v.array(v.number()), (ids) => {
	if (!ids.length) {
		return []
	}

	return $api({
		path: `/tracks`,
		params: {
			ids: ids.join(','),
			limit: paginated_limit,
		},
		schema: v.array(Track),
	})
})
