import type { Result } from 'neverthrow'
import { err, fromPromise, ok } from 'neverthrow'
import { ofetch } from 'ofetch/node'
import { z } from 'zod'

export async function $api<S extends z.ZodTypeAny | undefined, T = S extends z.ZodTypeAny ? z.infer<S> : any>({ path, params, schema }: { path: string, params?: Record<string, any>, schema?: S }): Promise<Result<T, Error>> {
  const clientId = await getClientId()

  if (clientId.isErr()) {
    return err(clientId.error)
  }

  const response = await fromPromise(
    ofetch(`https://api-v2.soundcloud.com${path}`, {
      params: {
        ...params,
        client_id: clientId.value,
      },
    }),
    error => new Error(`failed to fetch: ${error}`),
  )

  if (response.isErr()) {
    return err(response.error)
  }

  if (!schema) {
    return ok(response.value)
  }

  const { success, error, data } = schema.safeParse(response.value)

  if (!success) {
    console.error(z.prettifyError(error))
    return err(new Error('failed to pass validation'))
  }

  if (!data) {
    return err(new Error('response is nullish'))
  }

  return ok(data as T)
}

let clientId: string
let clientIdExpiry: number

export async function getClientId(): Promise<Result<string, Error>> {
  if (clientId && Date.now() < clientIdExpiry) {
    return ok(clientId)
  }

  const html = await fromPromise(
    fetch('https://soundcloud.com').then(r => r.text()),
    error => new Error(`failed to fetch soundcloak.com: ${error}`),
  )

  if (html.isErr()) {
    return err(html.error)
  }

  const scriptUrl = html.value.match(/<script crossorigin src="(https:\/\/a-v2\.sndcdn\.com\/assets\/0-[^"]+\.js)"><\/script>/)?.[1]

  if (!scriptUrl) {
    return err(new Error('script not found'))
  }

  const script = await fromPromise(
    fetch(scriptUrl).then(r => r.text()),
    error => new Error(`failed to fetch ${scriptUrl}: ${error}`),
  )

  if (script.isErr()) {
    return err(script.error)
  }

  const id = script.value.match(/client_id:"([A-Za-z0-9]{32})"/)?.[1]

  if (!id) {
    return err(new Error('client id not found'))
  }

  clientId = id
  clientIdExpiry = Date.now() + 30 * 60 * 1000

  return ok(clientId)
}

export function chunked<T>(arr: T[], { size = 32, index = 0 }: { size?: number, index?: number }) {
  const start = index * size
  const end = start + size
  return arr.slice(start, end)
}

export function withPagination<TArgs extends Record<string, any>, T>(
  fetcher: (opts: TArgs & { limit: number, offset: number }) => Promise<Result<T[], Error>>,
) {
  return async ({
    limit = 32,
    index = 0,
    ...rest
  }: TArgs & { limit?: number, index?: number }) => {
    const offset = index * limit
    const results = await fetcher({ ...(rest as TArgs), limit, offset })

    if (results.isErr()) {
      return err(results.error)
    }

    return ok({
      results: results.value,
      hasMore: results.value.length === limit,
    })
  }
}
