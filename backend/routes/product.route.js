
import { handleAddProduct, handleDeleteProduct, handleGetAllProducts, handleUpdateProduct } from "../controllers/product.controller.js";
import { Router } from "express";
import { verifyAdmin } from "../middlware/adminMiddleware.js";

const productRouter = Router()

productRouter.post('/add', verifyAdmin, handleAddProduct)
productRouter.get('/get-all', verifyAdmin, handleGetAllProducts)
productRouter.put('/edit/:id', verifyAdmin, handleUpdateProduct)
productRouter.delete('/delete/:id', verifyAdmin, handleDeleteProduct)

export { productRouter }