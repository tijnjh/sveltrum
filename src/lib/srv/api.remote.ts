import { query } from '$app/server'
import { playlist } from '$lib/schemas/playlist'
import { track } from '$lib/schemas/track'
import { user } from '$lib/schemas/user'
import { z } from 'zod'
import { $api } from './utils'

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

//

export const getTracksByIds = query(
  z.object({
    ids: z.number().array(),
    limit: z.number().optional(),
    offset: z.number().optional(),
  }),
  async ({ ids, limit = 32, offset }) => {
    const start = offset ?? 0
    const end = limit != null ? start + limit : undefined
    const pagedIds = ids.slice(start, end)

    if (!pagedIds.length) {
      return { tracks: [], hasMore: false }
    }

    const tracks = await $api({
      path: `/tracks`,
      params: { ids: pagedIds.join(',') },
      schema: track.array(),
    })

    return {
      tracks,
      hasMore: end != null && end < ids.length,
    }
  },
)

//
// search
//

async function baseSearch<T extends z.ZodType>({ kind, schema, query, limit, offset }: { kind: string, schema: T, query: string, limit?: number, offset?: number }) {
  const res = await $api({
    path: `/search/${kind}`,
    params: { q: query, limit, offset },
    schema: z.object({
      collection: z.array(schema),
    }),
  })

  return res.collection
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
    kind: 'playlists',
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
// user
//

async function baseGetUser<T extends z.ZodType>({ id, kind, schema, limit, offset }: { id: number, kind: string, schema: T, limit?: number, offset?: number }) {
  const res = await $api({
    path: `/users/${id}/${kind}`,
    params: { limit, offset },
    schema: z.object({
      collection: z.array(schema),
    }),
  })

  return res.collection
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

//
// discovery
//

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
