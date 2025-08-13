import { query } from '$app/server'
import { playlist } from '$lib/schemas/playlist'
import { track } from '$lib/schemas/track'
import { user } from '$lib/schemas/user'
import { z } from 'zod'
import { $api, chunked } from './utils'

export const getTrackById = query(z.number(), async id => await $api({
  path: `/tracks/${id}`,
  schema: track,
}))

export const getPlaylistById = query(z.number(), async id => await $api({
  path: `/playlists/${id}`,
  schema: playlist,
}))

export const getUserById = query(z.number(), async id => await $api({
  path: `/users/${id}`,
  schema: user,
}))

export const getTracksByIds = query(
  z.object({
    ids: z.number().array(),
    size: z.number().optional(),
    index: z.number().optional(),
  }),
  async ({ ids, size = 32, index = 0 }) => {
    const chunkedIds = chunked(ids, { size, index })

    if (!chunkedIds.length) {
      return { tracks: [], hasMore: false }
    }

    const tracks = await $api({
      path: `/tracks`,
      params: { ids: chunkedIds.join(',') },
      schema: track.array(),
    })

    return {
      tracks,
      hasMore: (index + 1) * size < ids.length,
    }
  },
)
