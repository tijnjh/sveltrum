import { z } from 'zod'

export const collectionSchema = <T extends z.ZodType>(t: T) =>
	z.strictObject({
		collection: z.array(t),
		next_href: z.string().nullish(),
		query_urn: z.string().nullish(),
		total_results: z.number().optional(),
		variant: z.string().optional(),
	})
