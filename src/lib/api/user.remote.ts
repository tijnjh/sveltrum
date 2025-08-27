import { query } from '$app/server'
import { playlist } from '$lib/schemas/playlist'
import { track } from '$lib/schemas/track'
import { err, ok } from 'neverthrow'
import { z } from 'zod'
import { $api, withPagination } from './utils'

const getUserSchema = z.object({
  id: z.number(),
  size: z.number().optional(),
  index: z.number().optional(),
})

function baseGetUser<T extends z.ZodType>(kind: string, schema: T) {
  return query(getUserSchema, withPagination(async ({ id, limit, offset }) => {
    const res = await $api({
      path: `/users/${id}/${kind}`,
      params: { limit, offset },
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

export const getUserTracks = baseGetUser('tracks', track)
export const getUserPlaylists = baseGetUser('playlists', playlist)
