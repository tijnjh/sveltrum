import { ClientIdNotFoundError, FetchError, ScriptUrlNotFoundError } from '$lib/errors'
import { Effect } from 'effect'

let clientId: string
let clientIdExpiry: number

export const getClientId = Effect.gen(function* () {
  if (clientId && Date.now() < clientIdExpiry) {
    return clientId
  }

  const html = yield* Effect.tryPromise({
    try: () => fetch('https://soundcloud.com').then(r => r.text()),
    catch: () => new FetchError({ message: 'Failed to fetch' }),
  })

  const scriptUrl = html.match(/<script crossorigin src="(https:\/\/a-v2\.sndcdn\.com\/assets\/0-[^"]+\.js)"><\/script>/)?.[1]

  if (!scriptUrl) {
    return yield* new ScriptUrlNotFoundError({ message: 'Failed to find script URL' })
  }

  const script = yield* Effect.tryPromise({
    try: () => fetch(scriptUrl).then(r => r.text()),
    catch: () => new FetchError({ message: 'Failed to fetch' }),
  })

  const id = script.match(/client_id:"([A-Za-z0-9]{32})"/)?.[1]

  if (!id) {
    return yield* new ClientIdNotFoundError({ message: 'client id not found' })
  }

  clientId = id
  clientIdExpiry = Date.now() + 30 * 60 * 1000

  return clientId
})
