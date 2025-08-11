import { query } from '$app/server'
import { FetchError } from '$lib/errors'
import { Effect, Schema as s } from 'effect'
import { standardSchemaV1 as ss } from 'effect/Schema'
import { ofetch } from 'ofetch'
import { track } from '../types'
import { getClientId } from './client-id'

const scApi = Effect.fn(function* (path: string, params?: Record<string, any>) {
  return yield* Effect.tryPromise({
    try: () => ofetch(`https://api-v2.soundcloud.com${path}`, {
      params: {
        client_id: Effect.runSync(getClientId),
        ...params,
      },
    }),
    catch: () => new FetchError({ message: 'failed to fetch' }),
  })
})

export const getResults = query(ss(s.Struct({ query: s.String, limit: s.UndefinedOr(s.Number) })), Effect.fn(function* ({ query, limit = 20 }) {
  const res = yield* scApi('/search/tracks', { q: query, limit })
  const out = yield* s.decode(s.Array(track))(res)
  return out
}))

export const getTrackById = query(ss(s.Union(s.String, s.Number)), Effect.fn(function* (trackId) {
  const res = yield* scApi(`/tracks/${trackId}`)
  const out = yield* s.decode(track)(res)
  return out
}))

// export const getScClientId = query(Effect.gen(function* () {
//   return yield* getClientId
// }))
