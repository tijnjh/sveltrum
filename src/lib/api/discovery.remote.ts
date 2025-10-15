import { query } from '$app/server'
import { collectionSchema } from '$lib/schemas/collection'
import { playlistSchema } from '$lib/schemas/playlist'
import { selectionSchema } from '$lib/schemas/selection'
import { trackSchema } from '$lib/schemas/track'
import { userSchema } from '$lib/schemas/user'
import { $api } from './utils'
import { z } from 'zod'

export const getSelections = query(async () => {
	const res = await $api({
		path: '/mixed-selections',
		schema: collectionSchema(
			selectionSchema(z.union([playlistSchema, userSchema])),
		),
	})

	return res.collection
})

export const getRelatedTracks = query(z.number(), (id) =>
	$api({
		path: `/tracks/${id}/related`,
		schema: collectionSchema(trackSchema),
	}),
)
