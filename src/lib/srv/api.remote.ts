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

export const getPlaylistById = query(z.number(), async id => await scApi({
  path: `/playlists/${id}`,
  schema: playlist,
}))

export const getUserById = query(z.number(), async id => await scApi({
  path: `/users/${id}`,
  schema: user,
}))

//

export const getTracksByIds = query(z.number().array(), async ids => await scApi({
  path: `/tracks`,
  params: { ids: ids.join(',') },
  schema: track.array(),
}))

//
//
//

async function baseSearch<T extends z.ZodType>({ kind, schema, query, limit, offset }: { kind: string, schema: T, query: string, limit?: number, offset?: number }) {
  const response = await scApi({
    path: `/search/${kind}`,
    params: { q: query, limit, offset },
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

//

export const searchTracks = query(searchSchema, async (opts) => {
  return baseSearch({
    kind: 'tracks',
    schema: track,
    ...opts,
  })
})

export const searchPlaylists = query(searchSchema, async (opts) => {
  return baseSearch({
    kind: 'playlist',
    schema: playlist,
    ...opts,
  })
})

export const searchUsers = query(searchSchema, async (opts) => {
  return baseSearch({
    kind: 'users',
    schema: user,
    ...opts,
  })
})

//
//
//

async function baseGetUser<T extends z.ZodType>({ id, kind, schema, limit, offset }: { id: number, kind: string, schema: T, limit?: number, offset?: number }) {
  const response = await scApi({
    path: `/users/${id}/${kind}`,
    params: { limit, offset },
    schema: z.object({
      collection: z.array(schema),
    }),
  })

  if (!response)
    throw new Error('response is nullish')

  return response.collection
}

const getUserSchema = z.object({
  id: z.number(),
  limit: z.number().optional(),
  offset: z.number().optional(),
})

//

export const getUserTracks = query(getUserSchema, async (opts) => {
  return baseGetUser({
    kind: 'tracks',
    schema: track,
    ...opts,
  })
})

export const getUserPlaylists = query(getUserSchema, async (opts) => {
  return baseGetUser({
    kind: 'playlists',
    schema: playlist,
    ...opts,
  })
})
