import type { Err, Ok } from 'dethrow'
import { dethrow, err, isErr, newErr, ok } from 'dethrow'
import { ofetch } from 'ofetch/node'
import { z } from 'zod'

export async function $api<S extends z.ZodTypeAny | undefined, T = S extends z.ZodTypeAny ? z.infer<S> : any>({ path, params, schema }: { path: string, params?: Record<string, any>, schema?: S }) {
  const clientId = await getClientId()

  if (isErr(clientId))
    return err(clientId.err)

  const response = await dethrow(ofetch(`https://api-v2.soundcloud.com${path}`, {
    params: {
      ...params,
      client_id: clientId.val,
    },
  }))

  if (isErr(response))
    return newErr(`something went wrong when trying to fetch from soundcloud: ${response.err}`)

  if (!schema)
    return ok(response.val as T)

  const { success, error, data } = schema.safeParse(response.val)

  if (!success) {
    console.error(z.prettifyError(error))
    return newErr('failed to pass validation')
  }

  if (!data)
    return newErr('response is nullish')

  return ok(data as T)
}

let clientId: string
let clientIdExpiry: number

export async function getClientId() {
  if (clientId && Date.now() < clientIdExpiry)
    return ok(clientId)

  const html = await fetch('https://soundcloud.com').then(r => r.text())
  const scriptUrl = html.match(/<script crossorigin src="(https:\/\/a-v2\.sndcdn\.com\/assets\/0-[^"]+\.js)"><\/script>/)?.[1]

  if (!scriptUrl)
    return newErr('script not found')

  const script = await fetch(scriptUrl).then(r => r.text())
  const id = script.match(/client_id:"([A-Za-z0-9]{32})"/)?.[1]

  if (!id)
    return newErr('client id not found')

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
  fetcher: (opts: TArgs & { limit: number, offset: number }) => Promise<Ok<T[]> | Err>,
) {
  return async ({
    limit = 32,
    index = 0,
    ...rest
  }: TArgs & { limit?: number, index?: number }) => {
    const offset = index * limit
    const results = await fetcher({ ...(rest as TArgs), limit, offset })

    if (isErr(results))
      return err(results.err)

    return ok({
      results: results.val,
      hasMore: results.val.length === limit,
    })
  }
}
