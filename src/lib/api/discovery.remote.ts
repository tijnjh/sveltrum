import { query } from '$app/server'
import { playlist } from '$lib/schemas/playlist'
import { err, ok } from 'dethrow'
import { z } from 'zod'
import { $api } from './utils'

export const getSelections = query(async () => {
  const res = await $api({
    path: '/mixed-selections',
    schema: z.object({
      collection: z.object({
        items: z.object({
          collection: playlist.array(),
        }),
      }).array(),
    }),
  })

  return res.isErr() ? err(res.err) : ok(res.val.collection)
})

export const getRelatedTracks = query(z.number(), async (id) => {
  const res = await $api({
    path: `/tracks/${id}/related`,
  })

  return res.isErr() ? err(res.err) : ok(res.val)
})
