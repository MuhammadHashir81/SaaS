import * as z from 'zod'

const productSchema = z.object({
    name:z
    .string({required_error:'name is required'})
})

export { productSchema }

