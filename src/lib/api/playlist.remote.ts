import { query } from '$app/server'
import { playlistSchema } from '$lib/schemas/playlist'
import { $api, getPermalinkPath } from './utils'
import { z } from 'zod'

export const resolvePlaylist = query(
	z.object({
		user: z.string(),
		playlist: z.string(),
	}),
	({ user, playlist }) =>
		$api({
			path: getPermalinkPath(user, 'sets', playlist),
			schema: playlistSchema,
		}),
)

export const getPlaylistById = query(z.number(), (id) =>
	$api({
		path: `/playlists/${id}`,
		schema: playlistSchema,
	}),
)
