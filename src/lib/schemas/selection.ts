import { collectionSchema } from './collection'
import { z } from 'zod'

export const selectionSchema = <T extends z.ZodType>(t: T) =>
	z.strictObject({
		description: z.string().nullable(),
		id: z.string(),
		items: collectionSchema(t),
		kind: z.literal('selection'),
		last_updated: z.string().nullable(),
		next_href: z.string().optional(),
		query_urn: z.string(),
		social_proof: z.string().nullable(),
		social_proof_users: z.string().nullable(),
		style: z.string().nullable(),
		title: z.string(),
		tracking_feature_name: z.string(),
		urn: z.string(),
	})
