import { query } from '$app/server'
import { err, ok } from 'dethrow'
import { ofetch } from 'ofetch/node'
import { z } from 'zod'
import { getTrackById } from './get-by-id.remote'
import { getClientId } from './utils'

export const getTrackSource = query(z.number(), async (trackId) => {
  const track = await getTrackById(trackId)

  if (track.isErr())
    return err(track.err)

  if (!track)
    return err('track not found' as const)

  const clientId = await getClientId()

  if (clientId.isErr())
    return err(clientId.err)

  const hlsTranscodings = track.val.media.transcodings.filter(({ format }) => format.protocol === 'hls')

  const transcoding = hlsTranscodings.find(({ preset }) => preset === 'aac_160k')
    ?? hlsTranscodings.find(({ format }) => format.mime_type === 'audio/mpeg')

  if (!transcoding)
    return err('hls transcoding not found' as const)

  const { url } = await ofetch(transcoding.url, {
    params: {
      track_authorization: track.val.track_authorization,
      client_id: clientId,
    },
  })

  return ok((Array.isArray(url) ? url[0] : url) as string)
})
