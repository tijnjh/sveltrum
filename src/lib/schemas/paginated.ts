import z from 'zod'

export const paginatedSchema = z.object({
	offset: z.number().optional(),
	limit: z.number().optional(),
})
