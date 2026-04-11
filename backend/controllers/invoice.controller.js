import { Invoice } from "../models/Invoice.model.js"
import { Customer } from "../models/customer.model.js"


// handle sold products 
const handleAddInvoices = async (req, res) => {
    const { customerId } = req.params
    const { product, customer } = req.body

    if (!customer) {
        return res.status(400).json({
            success: false,
            error: 'customer is required'
        })
    }
    // check if the customer exists or not 
    const findCustomer = await Customer.findById(customerId)

    if (!findCustomer) {
        return res.status(400).json({
            success: false,
            error: 'customer does not exists'
        })
    }


    product.map((p) => {
        if (!p.product || !p.qty || !p.rate)
            return res.status(400).json({
                error: 'all fields are required'
            })

    })

    console.log("this is the data we are getting", product, customer)


    try {


        // check if the customer already exists or not 
        const existingInvoice = await Invoice.findOne({ customerId })
        console.log(existingInvoice)

        if (existingInvoice) {
            existingInvoice.product.push(...product)
            await existingInvoice.save()
            return res.status(200).json({
                success: true,
                message: 'invoice created',
                data: existingInvoice
            })
        }

        const invoice = await Invoice.create({
            customerId,
            customer,
            product
        })
        res.status(200).json({
            success: true,
            message: 'Invoice created',
            data: invoice
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message })
    }

}

const handleGetAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.aggregate([
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customerInfo'
                }

            },

            {
                $lookup: {
                    from: 'invoices',
                    localField: 'customerInfo._id',
                    foreignField: 'customerId',
                    as: 'info'
                }
            },
            {
                $addFields: {
                    info: {
                        location: '$customerInfo.location'
                    }
                }
            },

            { $project: { customerInfo: 0 } },

            {
                $group: {
                    _id: '$info._id',
                    customer: { $first: "$info.customer" },
                    location: { $first: "$info.location" },
                    subTotal: { $first : "$info.subTotal"},
                    date: { $first : "$info.createdAt"}


                }
            }

        ])



        console.log(invoices)
        res.status(200).json({
            data: invoices,
            message: 'get all invoices of customers'
        })


    } catch (error) {
        res.status(500).json({
            error: error.message
        })

    }

}

export { handleAddInvoices, handleGetAllInvoices }