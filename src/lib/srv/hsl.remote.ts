import { query } from '$app/server'
import { FetchError } from '$lib/errors'
import { Data, Effect, Schema as s } from 'effect'
import { standardSchemaV1 as ss } from 'effect/Schema'
import { ofetch } from 'ofetch/node'
import { getClientId } from './client-id'
import { getTrackById } from './soundcloud.remote'

class HlsTranscodingNotFoundError extends Data.TaggedError('HlsTranscodingNotFoundError')<{ message: string }> { }

export const getTrackSource = query(ss(s.Number), Effect.fn(function* (trackId) {
  const track = yield* yield* Effect.tryPromise({
    try: () => getTrackById(trackId),
    catch: () => new Error('failed'),
  })
  const clientId = yield* getClientId

  if (!track)
    throw new Error('Failed to find track')

  const hlsTranscodings = track.media.transcodings.filter(({ format }) => format.protocol === 'hls')

  const transcoding = hlsTranscodings.find(({ preset }) => preset === 'aac_160k')
    ?? hlsTranscodings.find(({ format }) => format.mime_type === 'audio/mpeg')

  if (!transcoding)
    return yield* new HlsTranscodingNotFoundError({ message: 'Failed to find HLS transcoding' })

  const { url } = yield* Effect.tryPromise({
    try: () => ofetch(transcoding.url.toString(), {
      params: {
        track_authorization: track.track_authorization,
        client_id: clientId,
      },
    }),
    catch: () => new FetchError({ message: 'failed to fetch' }),
  })

  return (Array.isArray(url) ? url[0] : url) as string
}))

// export const getTrackSource = query(type('number'), async (trackId) => {

// })
