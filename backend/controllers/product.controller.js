import { Product } from "../models/product.model.js"
import { productSchema } from "../validations/product.validation.js"

const handleAddProduct = async (req, res) => {
    try {
        const { name, packing, batchNo, barcode } = req.body
        const result = productSchema.safeParse(req.body)

        if (!result.success) {
            const err = result.error.issues.map((e) => e.message)
            console.log(err)
            return res.status(400).json({
                success: false,
                error: err
            })
        }


        const savedPacking = await Product.create({
            name,
            packing,
            batchNo,
            barcode
        })
        res.status(201).json({
            sucess: true,
            message: 'packing created',
            data: savedPacking,
        })


    } catch (error) {
        res.status(error).json({ error })
    }

}

export { handleAddProduct }