
import { handleAddProduct, handleDeleteProduct, handleGetAllProducts, handleSearchedProducts,  handleUpdateProduct } from "../controllers/product.controller.js";
import { Router } from "express";
import { verifyAdmin } from "../middlware/adminMiddleware.js";
import { productSchema } from "../validations/product.validation.js";

const productRouter = Router()

productRouter.post('/add', verifyAdmin ,   handleAddProduct)
productRouter.get('/get-all', verifyAdmin, handleGetAllProducts)
productRouter.put('/edit/:id', verifyAdmin, handleUpdateProduct)
productRouter.delete('/delete/:id', verifyAdmin, handleDeleteProduct)
productRouter.get('/search', verifyAdmin, handleSearchedProducts)

export { productRouter }