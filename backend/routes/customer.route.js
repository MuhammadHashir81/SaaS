import { Router } from "express";
import { handleAddCustomers, handleDeleteCustomer, handleGetAllCustomers, handleUpdateCustomers } from "../controllers/customers.controller.js";
import { verifyAdmin } from "../middlware/adminMiddleware.js";


const customerRoute = Router()

customerRoute.post('/add', verifyAdmin, handleAddCustomers)
customerRoute.get('/get-all', verifyAdmin, handleGetAllCustomers)
customerRoute.put('/edit/:id', verifyAdmin, handleUpdateCustomers)
customerRoute.delete('/delete/:id', verifyAdmin, handleDeleteCustomer)

export { customerRoute }

