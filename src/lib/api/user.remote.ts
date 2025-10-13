import { query } from '$app/server'
import { playlist } from '$lib/schemas/playlist'
import { track } from '$lib/schemas/track'
import { $api, withPagination } from './utils'
import type { Type } from 'arktype'
import { type } from 'arktype'

const getUserSchema = type({
	id: 'number',
	size: 'number?',
	index: 'number?',
})

function baseGetUser<S extends Type<T>, T = type.infer<S>>(
	kind: string,
	schema: S,
) {
	return query(
		getUserSchema,
		withPagination(async ({ id, limit, offset }) => {
			const res = await $api({
				path: `/users/${id}/${kind}`,
				params: { limit, offset },
				schema: type({
					collection: schema.array(),
				}),
			})
			return res.collection
		}),
	)
}

export const getUserTracks = baseGetUser('tracks', track)
export const getUserPlaylists = baseGetUser('playlists', playlist)
