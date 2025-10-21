import { query } from '$app/server'
import { Collection } from '$lib/schemas/collection'
import { Paginated } from '$lib/schemas/paginated'
import { Playlist } from '$lib/schemas/playlist'
import { Track } from '$lib/schemas/track'
import { User } from '$lib/schemas/user'
import { $api, getPermalinkPath } from './utils'
import * as v from 'valibot'

export const resolveUser = query(v.string(), (user) =>
	$api({
		path: getPermalinkPath(user),
		schema: User,
	}),
)

export const getUserById = query(v.number(), (id) =>
	$api({
		path: `/users/${id}`,
		schema: User,
	}),
)

export const getUserTracks = query(
	v.object({
		...Paginated.entries,
		id: v.number(),
	}),
	({ id, limit, offset }) =>
		$api({
			path: `/users/${id}/tracks`,
			params: { limit, offset },
			schema: Collection(Track),
		}).then((r) => r.collection),
)

export const getUserPlaylists = query(
	v.object({
		...Paginated.entries,
		id: v.number(),
	}),
	({ id, limit, offset }) =>
		$api({
			path: `/users/${id}/playlists`,
			params: { limit, offset },
			schema: Collection(Playlist),
		}).then((r) => r.collection),
)
