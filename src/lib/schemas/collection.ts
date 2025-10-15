import * as v from 'valibot'

export const Collection = <T extends v.GenericSchema>(t: T) =>
	v.strictObject({
		collection: v.array(t),
		next_href: v.nullish(v.string()),
		query_urn: v.nullish(v.string()),
		total_results: v.optional(v.number()),
		variant: v.optional(v.string()),
	})
