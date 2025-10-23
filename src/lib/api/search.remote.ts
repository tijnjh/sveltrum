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
	async ({ query, offset, limit }) => {
		const response = await $api('/search/tracks', {
			params: { q: query, limit, offset },
			schema: Collection(Track),
		})
		return response.collection
	},
)

export const searchPlaylists = query(
	v.object({
		...Paginated.entries,
		query: v.string(),
	}),
	async ({ query, offset, limit }) => {
		const response = await $api('/search/playlists', {
			params: { q: query, limit, offset },
			schema: Collection(Playlist),
		})
		return response.collection
	},
)

export const searchUsers = query(
	v.object({
		...Paginated.entries,
		query: v.string(),
	}),
	async ({ query, offset, limit }) => {
		const response = await $api('/search/users', {
			params: { q: query, limit, offset },
			schema: Collection(User),
		})
		return response.collection
	},
)
