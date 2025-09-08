import { query } from '$app/server'
import { playlist } from '$lib/schemas/playlist'
import { track } from '$lib/schemas/track'
import { user } from '$lib/schemas/user'
import { type } from 'arktype'
import { $api, chunked } from './utils'

export const getTrackById = query(type('number'), id => $api({
  path: `/tracks/${id}`,
  schema: track,
}))

export const getPlaylistById = query(type('number'), id => $api({
  path: `/playlists/${id}`,
  schema: playlist,
}))

export const getUserById = query(type('number'), id => $api({
  path: `/users/${id}`,
  schema: user,
}))

export const getTracksByIds = query(
  type({
    ids: type('number').array(),
    size: 'number?',
    index: 'number?',
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
