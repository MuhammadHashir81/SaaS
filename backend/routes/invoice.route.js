import {Router} from 'express'
import { verifyAdmin } from '../middlware/adminMiddleware.js'
import { handleAddInvoices, handleGetAllInvoices,handleSearchInvoices,handleUpdateInvoice } from '../controllers/invoice.controller.js'

const invoiceRouter = Router()

invoiceRouter.post('/create/:customerId', verifyAdmin, handleAddInvoices)
invoiceRouter.get('/get-all',verifyAdmin, handleGetAllInvoices)
invoiceRouter.put('/edit/:id',verifyAdmin, handleUpdateInvoice)
invoiceRouter.get('/search',verifyAdmin, handleSearchInvoices)

export { invoiceRouter }
