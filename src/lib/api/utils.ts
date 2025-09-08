import { ofetch } from 'ofetch/node'
import { z } from 'zod'

export async function $api<S extends z.ZodTypeAny | undefined, T = S extends z.ZodTypeAny ? z.infer<S> : any>({ path, params, schema }: { path: string, params?: Record<string, any>, schema?: S }): Promise<T> {
  const response = await ofetch(`https://api-v2.soundcloud.com${path}`, {
    params: {
      ...params,
      client_id: await getClientId(),
    },
  })

  if (!schema)
    return response as T

  const { success, error, data } = schema.safeParse(response)

  if (!success) {
    console.error(z.prettifyError(error))
    throw new Error('failed to pass validation')
  }

  if (!data)
    throw new Error('response is nullish')

  return data as T
}

let clientId: string
let clientIdExpiry: number

export async function getClientId() {
  if (clientId && Date.now() < clientIdExpiry)
    return clientId

  const html = await fetch('https://soundcloud.com').then(r => r.text())
  const scriptUrl = html.match(/<script crossorigin src="(https:\/\/a-v2\.sndcdn\.com\/assets\/0-[^"]+\.js)"><\/script>/)?.[1]

  if (!scriptUrl)
    throw new Error('script not found')

  const script = await fetch(scriptUrl).then(r => r.text())
  const id = script.match(/client_id:"([A-Za-z0-9]{32})"/)?.[1]

  if (!id)
    throw new Error('client id not found')

  clientId = id
  clientIdExpiry = Date.now() + 30 * 60 * 1000

  return clientId
}

export function chunked<T>(arr: T[], { size = 32, index = 0 }: { size?: number, index?: number }) {
  const start = index * size
  const end = start + size
  return arr.slice(start, end)
}

export function withPagination<TArgs extends Record<string, any>, T>(
  fetcher: (opts: TArgs & { limit: number, offset: number }) => Promise<T[]>,
) {
  return async ({
    limit = 32,
    index = 0,
    ...rest
  }: TArgs & { limit?: number, index?: number }) => {
    const offset = index * limit
    const results = await fetcher({ ...(rest as TArgs), limit, offset })
    return {
      results,
      hasMore: results.length === limit,
    }
  }
}

export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null }
