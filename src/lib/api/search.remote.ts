import { query } from '$app/server'
import { Collection } from '$lib/schemas/collection'
import { Paginated } from '$lib/schemas/paginated'
import { Playlist } from '$lib/schemas/playlist'
import { Track } from '$lib/schemas/track'
import { User } from '$lib/schemas/user'
import { $api } from './utils'
import * as v from 'valibot'

export const searchTracks = query(
	v.object({
		...Paginated.entries,
		query: v.string(),
	}),
	({ query, limit, offset }) =>
		$api({
			path: '/search/tracks',
			params: { q: query, limit, offset },
			schema: Collection(Track),
		}).then((r) => r.collection),
)

export const searchPlaylists = query(
	v.object({
		...Paginated.entries,
		query: v.string(),
	}),
	({ query, limit, offset }) =>
		$api({
			path: '/search/playlists',
			params: { q: query, limit, offset },
			schema: Collection(Playlist),
		}).then((r) => r.collection),
)

export const searchUsers = query(
	v.object({
		...Paginated.entries,
		query: v.string(),
	}),
	({ query, limit, offset }) =>
		$api({
			path: '/search/users',
			params: { q: query, limit, offset },
			schema: Collection(User),
		}).then((r) => r.collection),
)
