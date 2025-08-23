import { query } from '$app/server'
import { playlist } from '$lib/schemas/playlist'
import { Effect } from 'effect'
import { z } from 'zod'
import { $api } from './utils'

export const getSelections = query(async () => Effect.gen(function* () {
  const res = yield* $api({
    path: '/mixed-selections',
    schema: z.object({
      collection: z.object({
        items: z.object({
          collection: playlist.array(),
        }),
      }).array(),
    }),
  })

  return res.collection
}))

export const getRelatedTracks = query(z.number(), id => Effect.gen(function* () {
  const res = yield* $api({
    path: `/tracks/${id}/related`,
  })

  return res
}))
