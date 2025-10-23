import { query } from '$app/server'
import { getTrackById } from './track.remote'
import { getClientId, upfetch } from './utils'
import * as v from 'valibot'

export const getTrackSource = query(v.number(), async (trackId) => {
	const track = await getTrackById(trackId)
	const clientId = await getClientId()

	if (!track) throw new Error('failed to find track')

	const hlsTranscodings = track.media.transcodings.filter(
		({ format }) => format.protocol === 'hls',
	)

	const transcoding =
		hlsTranscodings.find(({ preset }) => preset === 'aac_160k') ??
		hlsTranscodings.find(({ format }) => format.mime_type === 'audio/mpeg')

	if (!transcoding) throw new Error('failed to find hls transcoding')

	const { url } = await upfetch(transcoding.url, {
		params: {
			track_authorization: track.track_authorization,
			client_id: clientId,
		},
	})

	return (Array.isArray(url) ? url[0] : url) as string
})
