import { query } from '$app/server'
import { playlistSchema } from '$lib/schemas/playlist'
import { $api } from './utils'
import { z } from 'zod'

export const getPlaylistById = query(z.number(), (id) =>
	$api({
		path: `/playlists/${id}`,
		schema: playlistSchema,
	}),
)
