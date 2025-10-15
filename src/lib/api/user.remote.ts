import { query } from '$app/server'
import { Collection } from '$lib/schemas/collection'
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
		id: v.number(),
		offset: v.optional(v.number()),
		limit: v.optional(v.number()),
	}),
	async ({ id, offset, limit }) => {
		const res = await $api({
			path: `/users/${id}/tracks`,
			params: { limit, offset },
			schema: Collection(Track),
		})
		return res.collection
	},
)

export const getUserPlaylists = query(
	v.object({
		id: v.number(),
		offset: v.optional(v.number()),
		limit: v.optional(v.number()),
	}),
	async ({ id, offset, limit }) => {
		const res = await $api({
			path: `/users/${id}/playlists`,
			params: { limit, offset },
			schema: Collection(Playlist),
		})
		return res.collection
	},
)
