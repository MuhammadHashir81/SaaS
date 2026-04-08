import { Router } from "express";
import { handleAddCustomers, handleDeleteCustomer, handleGetAllCustomers, handleSearchedCustomers, handleUpdateCustomers } from "../controllers/customers.controller.js";
import { verifyAdmin } from "../middlware/adminMiddleware.js";


const customerRoute = Router()

customerRoute.post('/add', verifyAdmin, handleAddCustomers)
customerRoute.get('/get-all', verifyAdmin, handleGetAllCustomers)
customerRoute.get('/search', verifyAdmin, handleSearchedCustomers)
customerRoute.put('/edit/:id', verifyAdmin, handleUpdateCustomers)
customerRoute.delete('/delete/:id', verifyAdmin, handleDeleteCustomer)

export { customerRoute }

