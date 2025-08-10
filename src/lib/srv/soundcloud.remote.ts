import { query } from '$app/server'
import { type } from 'arktype'
import { ofetch } from 'ofetch'
import { track } from '../types'
import { getClientId } from './client-id'

async function scApi(path: string, params?: Record<string, any>) {
  return ofetch(`https://api-v2.soundcloud.com${path}`, {
    params: {
      client_id: await getClientId(),
      ...params,
    },
  })
}

export const getResults = query(type({ 'query': 'string', 'limit?': 'number' }), async ({ query, limit = 20 }) => {
  const res = await scApi('/search/tracks', { q: query, limit })

  const out = track.array()(res.collection)

  if (out instanceof type.errors) {
    console.error(out.summary)
    return null
  }

  return out
})

export const getTrackById = query(type('number | string'), async (trackId) => {
  const res = await scApi(`/tracks/${trackId}`)

  const out = track(res)

  if (out instanceof type.errors) {
    console.error(out.summary)
    return null
  }

  return out
})

export const getScClientId = query(async () => await getClientId())
