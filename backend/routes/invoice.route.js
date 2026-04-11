import {Router} from 'express'
import { verifyAdmin } from '../middlware/adminMiddleware.js'
import { handleAddInvoices, handleGetAllInvoices } from '../controllers/invoice.controller.js'

const invoiceRouter = Router()

invoiceRouter.post('/create/:customerId', verifyAdmin, handleAddInvoices)
invoiceRouter.get('/get-all',verifyAdmin, handleGetAllInvoices)

export { invoiceRouter }
