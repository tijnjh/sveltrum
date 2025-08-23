import { query } from '$app/server'
import { Effect } from 'effect'
import { ofetch } from 'ofetch/node'
import { z } from 'zod'
import { getTrackById } from './get-by-id.remote'
import { effectFromRq, getClientId } from './utils'

export const getTrackSource = query(z.number(), trackId => Effect.gen(function* () {
  const track = yield* effectFromRq(() => getTrackById(trackId))
  const clientId = yield* getClientId

  if (!track) {
    return yield* Effect.fail(new Error('failed to find track'))
  }

  const hlsTranscodings = track.media.transcodings.filter(({ format }) => format.protocol === 'hls')

  const transcoding = hlsTranscodings.find(({ preset }) => preset === 'aac_160k')
    ?? hlsTranscodings.find(({ format }) => format.mime_type === 'audio/mpeg')

  if (!transcoding) {
    return yield* Effect.fail(new Error('failed to find hls transcoding'))
  }

  const { url } = yield* Effect.tryPromise(() => ofetch(transcoding.url, {
    params: {
      track_authorization: track.track_authorization,
      client_id: clientId,
    },
  }))

  return (Array.isArray(url) ? url[0] : url) as string
}))
