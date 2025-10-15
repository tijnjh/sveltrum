import * as v from 'valibot'

export const Paginated = v.strictObject({
	limit: v.optional(v.number()),
	offset: v.optional(v.number()),
})

export type Paginated = v.InferOutput<typeof Paginated>
