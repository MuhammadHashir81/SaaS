import { Product } from "../models/product.model.js"
import { productSchema } from "../validations/product.validation.js"


// handle get all products
const handleGetAllProducts = async (req, res) => {
    try {
        const page  = Number(req.query.page) || 1
        const  limit  = Number(req.query.limit) || 10
        const skip =   (page - 1) * limit  

        const totalProducts = await Product.countDocuments()
        console.log(totalProducts)

        const totalPages = Math.ceil(totalProducts/limit)

        const products = await Product.find()
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limit)

        res.status(200).json({
            success: true,
            totalProducts:totalProducts,
            totalPages:totalPages,
            data: products,
            skip:skip

        })
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message })

    }

}

// handle add products
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

// handle update products 

const handleUpdateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { name, packing, batchNo, barcode } = req.body

        const updateProduct = {}
        if (name) updateProduct.name = name
        if (packing) updateProduct.packing = packing
        if (batchNo) updateProduct.batchNo = batchNo
        if (barcode) updateProduct.barcode = barcode

        const upatedProduct = await Product.findByIdAndUpdate(id, updateProduct)
        res.status(200).json({
            success: true,
            message: "product updated successfully",
            data: upatedProduct
        })

    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}

// handle delete products

const handleDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const deletedProduct = await Product.findByIdAndDelete(id)
        if (!id) {
            return res.status(404).json({
                success: false,
                message: 'product does not exists',
                data: deletedProduct
            })
        }
        res.status(200).json({
            success: true,
            message: 'product deleted successfully'
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}
export { handleAddProduct, handleGetAllProducts, handleUpdateProduct, handleDeleteProduct }