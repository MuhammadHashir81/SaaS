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
            product,
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


// update invoice



const handleUpdateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { customer, product } = req.body;

        console.log("Incoming products array:", product);

        const invoice = await Invoice.findOne({ customerId: id });

        if (!invoice) {
            return res.status(400).json({
                success: false,
                message: "Invoice does not exist",
            });
        }

        // product is an array, so map over the incoming array
        // and update each matching item in the invoice
        invoice.product = product.map((incomingItem) => {
            const existingItem = invoice.product.find(
                (item) => item.productId.toString() === incomingItem.productId
            );

            return {
                productId: incomingItem.productId,
                product: incomingItem.product ?? existingItem?.product,
                qty: incomingItem.qty ?? existingItem?.qty,
                rate: incomingItem.rate ?? existingItem?.rate,
                discount: incomingItem.discount ?? existingItem?.discount ?? 0,
            };
        });

        invoice.customer = customer || invoice.customer;

        const updatedInvoice = await invoice.save();

        return res.status(200).json({
            success: true,
            message: "Invoice updated",
            data: updatedInvoice,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error.message,
        });
    }
};


const handleGetAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.aggregate([
            // Join customer info
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customerInfo'
                }
            },
            // Flatten customerInfo array (it's always one customer)
            {
                $unwind: {
                    path: '$customerInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$product',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    customerId: 1,
                    // Pull customer fields out of the nested object
                    customer: '$customerInfo.name',
                    customerEmail: '$customerInfo.email',
                    customerPhone: '$customerInfo.phone',
                    product: '$product.product',
                    total: '$product.total',
                    subTotal: '$product.subTotal',
                    qty: '$product.qty',
                    rate: '$product.rate',
                    discount: '$product.discount',
                    location: '$customerInfo.location',
                    date: '$customerInfo.createdAt',
                }
            }





        ]);

        res.status(200).json({
            data: invoices,
            message: 'All invoices fetched successfully'
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


// filter invoices by customer, start date, end date, min and max total

const handleSearchInvoices = async (req, res) => {
    try {
        const { customer, startDate, endDate, minTotal, maxTotal } = req.query;
        console.log(customer, startDate, endDate, minTotal, maxTotal)

        const matchStage = {};

        if (customer) {
            matchStage.customer = { $regex: customer, $options: "i" };
        }

        if (minTotal !== undefined || maxTotal !== undefined) {
            matchStage.total = {};

            if (minTotal !== undefined) {
                matchStage.total.$gte = Number(minTotal);
            }

            if (maxTotal !== undefined) {
                matchStage.total.$lte = Number(maxTotal);
            }
        }

        if (startDate || endDate) {
            matchStage.createdAt = {};

            if (startDate) {
                matchStage.createdAt.$gte = new Date(startDate);
            }

            if (endDate) {
                matchStage.createdAt.$lte = new Date(endDate);
            }
        }

        const pipeline = [
            { $match: matchStage },
            { $sort: { createdAt: -1 } },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    customer: 1,
                    total: 1,
                    category: 1,
                    createdAt: 1,
                },
            },
        ];

        const invoices = await Invoice.aggregate(pipeline);
        console.log("these are all filtered invoices",invoices)

        res.status(200).json({
            success: true,
            count: invoices.length,
            filters: { customer, startDate, endDate, minTotal, maxTotal },
            data: invoices,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export { handleAddInvoices, handleGetAllInvoices, handleUpdateInvoice,handleSearchInvoices }