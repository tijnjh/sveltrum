import type { RemoteQuery } from '@sveltejs/kit'
import { Effect } from 'effect'
import { ofetch } from 'ofetch'
import { z } from 'zod'

let clientId: string
let clientIdExpiry: number

export const getClientId = Effect.gen(function* () {
  if (clientId && Date.now() < clientIdExpiry) {
    return clientId
  }

  const html = yield* Effect.tryPromise(() => fetch('https://soundcloud.com').then(r => r.text()))

  const scriptUrl = html.match(/<script crossorigin src="(https:\/\/a-v2\.sndcdn\.com\/assets\/0-[^"]+\.js)"><\/script>/)?.[1]

  if (!scriptUrl) {
    return yield* Effect.fail(new Error('script not found'))
  }

  const script = yield* Effect.tryPromise(() => fetch(scriptUrl).then(r => r.text()))
  const id = script.match(/client_id:"([A-Za-z0-9]{32})"/)?.[1]

  if (!id) {
    return yield* Effect.fail(new Error('client id not found'))
  }

  clientId = id
  clientIdExpiry = Date.now() + 30 * 60 * 1000

  return clientId
})

export const $api = <S extends z.ZodTypeAny | undefined, T = S extends z.ZodTypeAny ? z.infer<S> : any>({ path, params, schema }: { path: string, params?: Record<string, any>, schema?: S }) => Effect.gen(function* () {
  const cliendId = yield* getClientId

  const response = yield* Effect.tryPromise({
    try: async () => await ofetch(`https://api-v2.soundcloud.com${path}`, {
      params: {
        ...params,
        client_id: cliendId,
      },
    }),
    catch: () => new Error('failed to fetch from soundcloud'),
  })

  if (!schema) {
    return response as T
  }

  const { success, error, data } = schema.safeParse(response)

  if (!success) {
    console.error(z.prettifyError(error))
    return yield* Effect.fail(new Error('failed to pass validation'))
  }

  if (!data) {
    return yield* Effect.fail(new Error('response is nullish'))
  }

  return data as T
})

export function chunked<T>(arr: T[], { size = 32, index = 0 }: { size?: number, index?: number }) {
  const start = index * size
  const end = start + size
  return arr.slice(start, end)
}

export const withPagination = <TArgs extends Record<string, any>, T>(
  fetcher: <R = never>(opts: TArgs & { limit: number, offset: number }) => Effect.Effect<T[], Error, R>,
) => ({ limit = 32, index = 0, ...rest }: TArgs & { limit?: number, index?: number }) => Effect.gen(function* () {
  const offset = index * limit
  const results = yield* fetcher({ ...(rest as TArgs), limit, offset })
  return {
    results,
    hasMore: results.length === limit,
  }
})

export const effectFromRq = <A, E, R>(thunk: () => RemoteQuery<Effect.Effect<A, E, R>>) => Effect.gen(function* () {
  const rq = thunk()
  if (!rq.ready) {
    return yield* Effect.fail(new Error('remote query isnt ready yet'))
  }
  return yield* rq.current
})
