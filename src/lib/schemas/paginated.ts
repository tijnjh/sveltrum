import { z } from 'zod'

export const paginatedSchema = z.object({
	limit: z.number().optional(),
	offset: z.number().optional(),
})
