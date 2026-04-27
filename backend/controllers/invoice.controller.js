import { Invoice } from "../models/Invoice.model.js"
import { Customer } from "../models/customer.model.js"
import puppeteer from 'puppeteer';


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



    // get all invoices
    const handleGetAllInvoices = async (req, res) => {
        try {
            const page = Number(req.query.page) || 1
            console.log(page)
            const limit = Number(req.query.limit) || 10
            console.log(limit)
            const skip = (page - 1) * limit
            console.log(skip)

            const totalInvoices = await Invoice.countDocuments()

            const totalPages = Math.ceil(totalInvoices / limit)

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
                        customer: '$customerInfo.name',
                        customerEmail: '$customerInfo.email',
                        customerPhone: '$customerInfo.phone',
                        product: '$product.product',
                        total: '$product.total',
                        subTotal: '$product.subTotal',
                        qty: '$product.qty',
                        rate: '$product.rate',
                        packing: '$product.packing',
                        discount: '$product.discount',
                        location: '$customerInfo.location',
                        ntn: '$customerInfo.ntn',
                        strn: '$customerInfo.strn',
                        batchNo: '$product.batchNo',
                        date: '$createdAt',
                    }
                },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit }

            ]);

            res.status(200).json({
                data: invoices,
                totalPages:totalPages,
                totalInvoices:totalInvoices,
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
        console.log("these are all filtered invoices", invoices)

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


// handle download pdf

const handlePdfDownload = async (req, res) => {
    try {
        const {
            customer,
            date,
            address,
            ntn,
            strn,
            product,
            packing,
            qty,
            batchNo,
            rate,
            total,
            id
        } = req.body

        const browser = await puppeteer.launch({
            headless: "new"
        })

        const page = await browser.newPage()

        // HTML Template
        const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
          }
          .card {
            border: 1px solid #ddd;
            padding: 15px;
            margin-bottom: 20px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
          .label {
            color: gray;
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background: #f5f5f5;
          }
          .totals {
            width: 300px;
            margin-left: auto;
            margin-top: 20px;
            border: 1px solid #ddd;
            padding: 15px;
          }
          .flex {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
        </style>
      </head>

      <body>

        <div class="header">
          <div class="title">Invoice #${id}</div>
          <div>${date}</div>
        </div>

        <div class="card grid">
          <div>
            <div class="label">Customer Name</div>
            <div>${customer}</div>
          </div>

          <div>
            <div class="label">Customer No</div>
            <div>${id}</div>
          </div>

          <div>
            <div class="label">Address</div>
            <div>${address}</div>
          </div>

          <div>
            <div class="label">NTN</div>
            <div>${ntn || "-"}</div>
          </div>

          <div>
            <div class="label">STRN</div>
            <div>${strn || "-"}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Packing</th>
              <th>Batch</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>${product}</td>
              <td>${packing}</td>
              <td>${batchNo}</td>
              <td>${qty}</td>
              <td>${rate}</td>
              <td>${qty * rate}</td>
            </tr>
          </tbody>
        </table>

        <div class="totals">
          <div class="flex">
            <span>Sub Total</span>
            <span>${total}</span>
          </div>

          <div class="flex">
            <span>Discount</span>
            <span>0.00</span>
          </div>

          <div class="flex" style="font-weight:bold;">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>

      </body>
    </html>
    `

        await page.setContent(html, { waitUntil: "domcontentloaded" })

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true
        })

        await browser.close()

        // Send PDF as response
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=invoice-${id}.pdf`,
            "Content-Length": pdfBuffer.length
        })

        res.send(pdfBuffer)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
}

export { handleAddInvoices, handleGetAllInvoices, handleUpdateInvoice, handleSearchInvoices, handlePdfDownload }
