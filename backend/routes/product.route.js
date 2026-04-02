import { handleAddProduct } from "../controllers/product.controller.js";
import { Router } from "express";

const productRouter = Router()

productRouter.post('/add',handleAddProduct)

export { productRouter }