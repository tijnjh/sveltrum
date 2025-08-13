import { query } from '$app/server'
import { playlist } from '$lib/schemas/playlist'
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

  return res.collection
})
