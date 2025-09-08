import { query } from '$app/server'
import { playlist } from '$lib/schemas/playlist'
import { track } from '$lib/schemas/track'
import { type } from 'arktype'
import { $api } from './utils'

export const getSelections = query(async () => {
  const res = await $api({
    path: '/mixed-selections',
    schema: type({
      collection: type({
        items: type({
          collection: playlist.array(),
        }),
      }).array(),
    }),
  })

  return res.collection
})

export const getRelatedTracks = query(type('number'), id => $api({
  path: `/tracks/${id}/related`,
  schema: type({
    collection: track.array(),
  }),
}))
