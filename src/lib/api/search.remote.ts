import { query } from '$app/server'
import { playlist } from '$lib/schemas/playlist'
import { track } from '$lib/schemas/track'
import { user } from '$lib/schemas/user'
import { err, ok } from 'neverthrow'
import { z } from 'zod'
import { $api, withPagination } from './utils'

const searchSchema = z.object({
  query: z.string(),
  limit: z.number().optional(),
  index: z.number().optional(),
})

function baseSearch<T extends z.ZodType>(kind: string, schema: T) {
  return query(searchSchema, withPagination(async ({ limit, offset, query }) => {
    const res = await $api({
      path: `/search/${kind}`,
      params: { q: query, limit, offset },
      schema: z.object({
        collection: z.array(schema),
      }),
    })

    if (res.isErr()) {
      return err(res.error)
    }

    return ok(res.value.collection)
  }))
}

export const searchTracks = baseSearch('tracks', track)
export const searchPlaylists = baseSearch('playlists', playlist)
export const searchUsers = baseSearch('users', user)
