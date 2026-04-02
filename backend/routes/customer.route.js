import { Router } from "express";
import { handleAddCustomers, handleDeleteCustomer, handleGetAllCustomers,handleUpdateCustomers } from "../controllers/customers.controller.js";

const customerRoute = Router()

customerRoute.post('/add', handleAddCustomers)
customerRoute.get('/get-all', handleGetAllCustomers)
customerRoute.put('/edit/:id', handleUpdateCustomers)
customerRoute.delete('/delete/:id',handleDeleteCustomer)

export { customerRoute }

