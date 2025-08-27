import type { Result } from 'neverthrow'
import { query } from '$app/server'
import { err, ok } from 'neverthrow'
import { ofetch } from 'ofetch/node'
import { z } from 'zod'
import { getTrackById } from './get-by-id.remote'
import { getClientId } from './utils'

export const getTrackSource = query(z.number(), async (trackId): Promise<Result<string, Error>> => {
  const track = await getTrackById(trackId)
  const clientId = await getClientId()

  if (track.isErr()) {
    return err(track.error)
  }

  if (!track.value) {
    return err(new Error('failed to find track'))
  }

  const hlsTranscodings = track.value.media.transcodings.filter(({ format }) => format.protocol === 'hls')

  const transcoding = hlsTranscodings.find(({ preset }) => preset === 'aac_160k')
    ?? hlsTranscodings.find(({ format }) => format.mime_type === 'audio/mpeg')

  if (!transcoding) {
    return err(new Error('failed to find hls transcoding'))
  }

  const { url } = await ofetch(transcoding.url, {
    params: {
      track_authorization: track.value.track_authorization,
      client_id: clientId,
    },
  })

  return ok((Array.isArray(url) ? url[0] : url) as string)
})
