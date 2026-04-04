import * as z from 'zod'

const customerSchema = z.object({
    name: z
        .string({ required_error: 'name is required' })
        .min(1, { message: 'name is required' })
        .min(2, { message: 'name must be at least 2 characters long' })
        .max(50, { message: 'name must not exceed 50 characters' }),

    location: z
        .string({ required_error: 'location is required' })
        .min(1, { message: 'location is required' })
        .min(2, { message: 'location must be at least 2 characters long' })
        .max(50, { message: 'location must not exceed 50 characters' }),
})

export {customerSchema}