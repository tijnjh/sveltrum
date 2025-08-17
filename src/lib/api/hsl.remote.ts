import { query } from '$app/server'
import { err, isErr, newErr, ok } from 'dethrow'
import { ofetch } from 'ofetch/node'
import { z } from 'zod'
import { getTrackById } from './get-by-id.remote'
import { getClientId } from './utils'

export const getTrackSource = query(z.number(), async (trackId) => {
  const track = await getTrackById(trackId)

  if (isErr(track))
    return err(track.err)

  if (!track)
    return newErr('failed to find track')

  const clientId = await getClientId()

  if (isErr(clientId))
    return err(clientId.err)

  const hlsTranscodings = track.val.media.transcodings.filter(({ format }) => format.protocol === 'hls')

  const transcoding = hlsTranscodings.find(({ preset }) => preset === 'aac_160k')
    ?? hlsTranscodings.find(({ format }) => format.mime_type === 'audio/mpeg')

  if (!transcoding)
    return newErr('failed to find hls transcoding')

  const { url } = await ofetch(transcoding.url, {
    params: {
      track_authorization: track.val.track_authorization,
      client_id: clientId,
    },
  })

  return ok((Array.isArray(url) ? url[0] : url) as string)
})
