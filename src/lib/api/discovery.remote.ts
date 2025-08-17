import { query } from '$app/server'
import { playlist } from '$lib/schemas/playlist'
import { err, isErr, ok } from 'dethrow'
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

  if (isErr(res))
    return err(res.err)

  return ok(res.val.collection)
})

export const getRelatedTracks = query(z.number(), async (id) => {
  const res = await $api({
    path: `/tracks/${id}/related`,
  })

  return res
})
