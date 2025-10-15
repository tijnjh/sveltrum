import { Collection } from './collection'
import * as v from 'valibot'

export const Selection = <T extends v.GenericSchema>(t: T) =>
	v.strictObject({
		description: v.nullable(v.string()),
		id: v.string(),
		items: Collection(t),
		kind: v.literal('selection'),
		last_updated: v.nullable(v.string()),
		next_href: v.optional(v.string()),
		query_urn: v.string(),
		social_proof: v.nullable(v.string()),
		social_proof_users: v.nullable(v.string()),
		style: v.nullable(v.string()),
		title: v.string(),
		tracking_feature_name: v.string(),
		urn: v.string(),
	})
