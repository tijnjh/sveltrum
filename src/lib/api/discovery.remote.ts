import { query } from '$app/server'
import { Collection } from '$lib/schemas/collection'
import { Playlist } from '$lib/schemas/playlist'
import { Selection } from '$lib/schemas/selection'
import { Track } from '$lib/schemas/track'
import { User } from '$lib/schemas/user'
import { $api } from './utils'
import * as v from 'valibot'

export const getSelections = query(() =>
	$api({
		path: '/mixed-selections',
		schema: Collection(Selection(v.union([Playlist, User]))),
	}).then((r) => r.collection),
)

export const getRelatedTracks = query(v.number(), (id) =>
	$api({
		path: `/tracks/${id}/related`,
		schema: Collection(Track),
	}),
)
