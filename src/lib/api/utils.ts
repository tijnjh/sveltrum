import type { Type } from 'arktype'
import { type } from 'arktype'
import { ofetch } from 'ofetch'

type Decodable =
	| string
	| number
	| boolean
	| null
	| undefined
	| Decodable[]
	| { [key: string]: Decodable }

export async function $api<S extends Type, T = type.infer<S>>({
	path,
	params,
	schema,
}: {
	path: string
	params?: Record<string, Decodable>
	schema?: S
}): Promise<T> {
	const response = await ofetch(`https://api-v2.soundcloud.com${path}`, {
		params: {
			...params,
			client_id: await getClientId(),
		},
	})

	if (!schema) return response as T

	const out = schema(response)

	if (out instanceof type.errors) {
		console.error(out.summary)
		throw new Error('failed to pass validation')
	}

	if (!out) throw new Error('response is nullish')

	return out as T
}

let clientId: string
let clientIdExpiry: number

export async function getClientId() {
	if (clientId && Date.now() < clientIdExpiry) return clientId

	const html = await fetch('https://soundcloud.com').then((r) => r.text())
	const scriptUrl = html.match(
		/<script crossorigin src="(https:\/\/a-v2\.sndcdn\.com\/assets\/0-[^"]+\.js)"><\/script>/,
	)?.[1]

	if (!scriptUrl) throw new Error('script not found')

	const script = await fetch(scriptUrl).then((r) => r.text())
	const id = script.match(/client_id:"([A-Za-z0-9]{32})"/)?.[1]

	if (!id) throw new Error('client id not found')

	clientId = id
	clientIdExpiry = Date.now() + 30 * 60 * 1000

	return clientId
}

export function chunked<T>(
	arr: T[],
	{ size = 32, index = 0 }: { size?: number; index?: number },
) {
	const start = index * size
	const end = start + size
	return arr.slice(start, end)
}

export function withPagination<TArgs extends Record<string, Decodable>, T>(
	fetcher: (opts: TArgs & { limit: number; offset: number }) => Promise<T[]>,
) {
	return async ({
		limit = 32,
		index = 0,
		...rest
	}: TArgs & { limit?: number; index?: number }) => {
		const offset = index * limit
		const results = await fetcher({ ...(rest as TArgs), limit, offset })
		return {
			results,
			hasMore: results.length === limit,
		}
	}
}
