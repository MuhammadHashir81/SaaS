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
                soldAt: existingItem?.soldAt ?? new Date(),
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
                    date: '$createdAt',
                }
            },

          {$sort: { createdAt: -1 }}

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

        const pipeline = [
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customerInfo'
                }
            },
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
            }
        ];

        const matchStage = {};

        if (customer?.trim()) {
            matchStage['customerInfo.name'] = { $regex: customer.trim(), $options: "i" };
        }

        const hasMinTotal = minTotal !== undefined && minTotal !== "";
        const hasMaxTotal = maxTotal !== undefined && maxTotal !== "";

        if (hasMinTotal || hasMaxTotal) {
            const totalMatch = {};

            if (hasMinTotal) {
                totalMatch.$gte = Number(minTotal);
            }

            if (hasMaxTotal) {
                totalMatch.$lte = Number(maxTotal);
            }

            if (Object.keys(totalMatch).length > 0) {
                matchStage['product.total'] = totalMatch;
            }
        }

        if (startDate || endDate) {
            const dateMatch = {};

            if (startDate) {
                dateMatch.$gte = new Date(startDate);
            }

            if (endDate) {
                const inclusiveEndDate = new Date(endDate);
                inclusiveEndDate.setHours(23, 59, 59, 999);
                dateMatch.$lte = inclusiveEndDate;
            }

            if (Object.keys(dateMatch).length > 0) {
                matchStage.createdAt = dateMatch;
            }
        }

        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        pipeline.push(
            {
                $project: {
                    _id: 1,
                    customerId: 1,
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
                    date: '$updatedAt',
                },
            },
            { $sort: { createdAt: -1 } },
        );

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

// get single invoice by id
const handleGetInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const invoice = await Invoice.findById(id)
            .populate('customerId', 'name email phone location');
        
        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }
        
        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// download invoice as PDF
const handleDownloadInvoicePDF = async (req, res) => {
    try {
        const { id } = req.params;
        
        const invoice = await Invoice.findById(id)
            .populate('customerId', 'name email phone location address');
        
        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }
        
        // For now, return a simple PDF generation response
        // In a real implementation, you would use a PDF library like puppeteer or jsPDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${id}.pdf`);
        
        // Simple PDF content (you should replace this with proper PDF generation)
        const pdfContent = `
Invoice Details
===============
Invoice ID: ${invoice._id}
Date: ${new Date(invoice.createdAt).toLocaleDateString()}
Customer: ${invoice.customer}
Customer ID: ${invoice.customerId}

Products:
--------
${invoice.product.map((item, index) => `
${index + 1}. ${item.product}
   Quantity: ${item.qty}
   Rate: $${item.rate}
   Discount: $${item.discount || 0}
   Total: $${(item.total || (item.qty * item.rate) - (item.discount || 0)).toFixed(2)}
`).join('')}

Grand Total: $${invoice.product.reduce((sum, item) => 
    sum + (item.total || (item.qty * item.rate) - (item.discount || 0)), 0
).toFixed(2)}
        `;
        
        res.send(pdfContent);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export { handleAddInvoices, handleGetAllInvoices, handleUpdateInvoice, handleSearchInvoices, handleGetInvoiceById, handleDownloadInvoicePDF }
