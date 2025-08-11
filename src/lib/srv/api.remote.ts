import { query } from '$app/server'
import { playlist } from '$lib/schemas/playlist'
import { track } from '$lib/schemas/track'
import { user } from '$lib/schemas/user'
import { z } from 'zod'
import { scApi } from './utils'

export const getTrackById = query(z.number(), async id => await scApi({
  path: `/tracks/${id}`,
  schema: track,
}))

export const getTracksByIds = query(z.number().array(), async ids => await scApi({
  path: `/tracks`,
  params: { ids: ids.join(',') },
  schema: track.array(),
}))

//

export const getPlaylistById = query(z.number(), async id => await scApi({
  path: `/playlists/${id}`,
  schema: playlist,
}))

//

export const getUserById = query(z.number(), async id => await scApi({
  path: `/users/${id}`,
  schema: user,
}))

//

async function baseSearch<T extends z.ZodType>(kind: string, schema: T, { query, limit }: { query: string, limit?: number }) {
  const response = await scApi({
    path: `/search/${kind}`,
    params: { q: query, limit },
    schema: z.object({
      collection: z.array(schema),
    }),
  })

  if (!response)
    throw new Error('response is nullish')

  return response.collection
}

const searchSchema = z.object({
  query: z.string(),
  limit: z.number().optional(),
  offset: z.number().optional(),
})

export const searchTracks = query(searchSchema, async opts => baseSearch('tracks', track, opts))
export const searchPlaylists = query(searchSchema, async opts => baseSearch('playlists', playlist, opts))
export const searchUsers = query(searchSchema, async opts => baseSearch('users', user, opts))
