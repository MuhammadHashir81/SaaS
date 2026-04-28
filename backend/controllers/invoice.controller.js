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
            totalPages: totalPages,
            totalInvoices: totalInvoices,
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
            discount,
            subTotal,
            id
        } = req.body

        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        const formattedDate = date
            ? new Date(date).toLocaleDateString('en-US', {
                day: '2-digit', month: 'long', year: 'numeric'
            })
            : '-'

        const html = `
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: Arial, sans-serif;
            font-size: 13px;
            padding: 30px 40px;
            color: #000;
          }

          /* ── HEADER ── */
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            border-bottom: 2px solid #000;
            padding-bottom: 12px;
          }
          .logo-block {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .logo-box {
            border: 2px solid #000;
            padding: 6px 12px;
            font-size: 20px;
            font-style: italic;
            font-weight: bold;
            letter-spacing: 1px;
          }
          .ntn-label {
            font-size: 12px;
            margin-top: 4px;
            font-weight: bold;
          }
          .company-info {
            text-align: center;
            flex: 1;
          }
          .company-name {
            font-size: 26px;
            font-weight: 600;
            letter-spacing: 2px;
          }
          .company-subtitle {
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 1px;
            margin-bottom: 4px;
          }
          .company-address {
            font-size: 11px;
            line-height: 1.5;
          }

          /* ── CUSTOMER INFO ── */
          .customer-section {
            display: flex;
            justify-content: space-between;
            margin: 14px 0;
            font-size: 13px;
          }
          .customer-section .left p,
          .customer-section .right p {
            margin-bottom: 4px;
          }
          .customer-section span {
            font-weight: bold;
          }
          .divider {
            border: none;
            border-top: 1px solid #000;
            margin: 10px 0;
          }

          /* ── TABLE ── */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #555;
            padding: 7px 8px;
            text-align: left;
          }
          th {
            background: #fff;
            font-weight: bold;
            text-align: center;
          }
          td {
            text-align: center;
          }
          td.product-name {
            text-align: left;
          }

          /* ── BOTTOM SECTION ── */
          .bottom {
            display: flex;
            margin-top: 16px;
            gap: 0;
          }
          .warranty {
            border: 1px solid #555;
            padding: 10px 12px;
            font-size: 11px;
            flex: 1;
            line-height: 1.6;
          }
          .warranty strong {
            display: block;
            margin-bottom: 4px;
            font-size: 12px;
          }
          .totals-table {
            border-collapse: collapse;
            width: 220px;
            font-size: 13px;
          }
          .totals-table td {
            border: 1px solid #555;
            padding: 8px 12px;
            text-align: left;
          }
          .totals-table td:last-child {
            text-align: right;
            min-width: 80px;
          }
          .totals-table tr:last-child td {
            font-weight: bold;
          }

          /* ── SIGNATURE ── */
          .signature {
            text-align: right;
            margin-top: 40px;
            font-size: 13px;
          }
          .signature-line {
            display: inline-block;
            border-top: 1px solid #000;
            width: 200px;
            margin-left: 8px;
          }
        </style>
      </head>
      <body>

        <!-- HEADER -->
        <div class="header">
          <div class="logo-block">
            <div>
              <div class="logo-box">Greenburg</div>
              <div class="ntn-label">NTN# 1018404-0</div>
            </div>
          </div>
          <div class="company-info">
            <div class="company-name">GREEN BURG</div>
            <div class="company-subtitle">MARKETING NETWORK</div>
            <div class="company-address">
              GREEN BURG MARKETING NETWORK, GROUND FLOOR SHOP NO.03,<br/>
              PLOT NO.250 RAILWAY SCHEME NO.09 CHAKLALA, Rawalpindi.<br/>
              Ph: 0322-5058166, Email: salteen_ls@yahoo.com
            </div>
          </div>
        </div>

        <!-- CUSTOMER INFO -->
        <div class="customer-section">
          <div class="left">
            <p>Customer Name: <span>${customer}</span></p>
            <p>Address: <span>${address}</span></p>
            ${ntn ? `<p>NTN: <span>${ntn}</span></p>` : ''}
            ${strn ? `<p>STRN: <span>${strn}</span></p>` : ''}
          </div>
          <div class="right" style="text-align:right;">
            <p>No. <span>${id}</span></p>
            <p>Date: <span>${formattedDate}</span></p>
          </div>
        </div>

        <hr class="divider"/>

        <!-- PRODUCT TABLE -->
        <table>
          <thead>
            <tr>
              <th>S.#</th>
              <th>Qty.</th>
              <th>Barcode</th>
              <th style="text-align:left;">Product</th>
              <th>Packing</th>
              <th>Batch No.</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>${qty}</td>
              <td>${batchNo || ''}</td>
              <td class="product-name">${product}</td>
              <td>${packing || ''}</td>
              <td>${batchNo || ''}</td>
              <td>${rate}</td>
              <td>${subTotal}</td>
            </tr>
          </tbody>
        </table>

        <!-- BOTTOM: WARRANTY + TOTALS -->
        <div class="bottom">
          <div class="warranty">
            <strong>WARRANTY:</strong>
            We Greenburg certify that the products described in this invoice are general consumer
            products and are not the drugs such as herbal medicines nutraceuticals and allopathic
            pharmaceuticals products therefore such product are not required by law to be registered
            under drug act category.
          </div>
          <table class="totals-table">
            <tr>
              <td>Total</td>
              <td>${subTotal}</td>
            </tr>
            <tr>
              <td>Ds.</td>
              <td>${discount ?? ''}</td>
            </tr>
            <tr>
              <td>G. Total</td>
              <td>${total}</td>
            </tr>
          </table>
        </div>

        <!-- SIGNATURE -->
        <div class="signature">
          Signature: <span class="signature-line"></span>
        </div>

      </body>
    </html>
    `

        await page.setContent(html, { waitUntil: 'networkidle0' })

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true
        })

        await browser.close()

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
        res.setHeader("Content-Length", pdfBuffer.length);

        return res.end(pdfBuffer);

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
}

export { handleAddInvoices, handleGetAllInvoices, handleUpdateInvoice, handleSearchInvoices, handlePdfDownload }
