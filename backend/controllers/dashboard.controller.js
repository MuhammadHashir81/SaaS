import { Invoice } from "../models/Invoice.model.js";
import mongoose from "mongoose";
import { Outflow } from "../models/Outflow.model.js";

const getDateRange = (range) => {
    const now = new Date();
    let startDate, endDate = new Date();

    switch (range) {
        case "Today":
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            break;
        case "Last 7 Days":
            startDate = new Date();
            startDate.setDate(now.getDate() - 7);
            break;
        case "Last 30 Days":
            startDate = new Date();
            startDate.setDate(now.getDate() - 30);
            break;
        case "This Month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case "Last Month":
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 0);
            break;
        case "Last 3 Months":
            startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            break;
        case "Last 6 Months":
            startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
            break;
        case "Last 9 Months":
            startDate = new Date(now.getFullYear(), now.getMonth() - 9, 1);
            break;
        case "Last 12 Months":
            startDate = new Date(now.getFullYear(), now.getMonth() - 12, 1);
            break;
        case "This year":
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        case "Last year":
            startDate = new Date(now.getFullYear() - 1, 0, 1);
            endDate = new Date(now.getFullYear() - 1, 11, 31);
            break;
        case "All Time":
        default:
            startDate = null;
            endDate = null;
    }

    return { startDate, endDate };
};

const handleGetDashboardSummary = async (req, res) => {
    try {
        const { range, startDate, endDate, product, customer } = req.body;

        let filter = {};

        // Date filter
        let dateFilter = {};

        if (range && range !== "All Time") {
            const dates = getDateRange(range);
            if (dates.startDate) {
                dateFilter.$gte = dates.startDate;
                dateFilter.$lte = dates.endDate;
            }
        }

        if (startDate && endDate) {
            dateFilter = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        if (Object.keys(dateFilter).length > 0) {
            filter.createdAt = dateFilter;
        }

        // Product filter
        if (product) {
            filter["product.productId"] = new mongoose.Types.ObjectId(product);
        }

        // Customer filter
        if (customer) {
            filter.customerId = new mongoose.Types.ObjectId(customer);
        }

        // 🔥 1. DAILY INFLOW
        const inflowByDate = await Invoice.aggregate([
            { $match: filter },
            { $unwind: "$product" },
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt"
                            }
                        }
                    },
                    inflow: { $sum: "$product.total" }
                }
            }
        ]);

        // 🔥 2. DAILY OUTFLOW
        let outflowFilter = {};
        if (filter.createdAt) {
            outflowFilter.createdAt = filter.createdAt;
        }

        const outflowByDate = await Outflow.aggregate([
            { $match: outflowFilter },
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt"
                            }
                        }
                    },
                    outflow: { $sum: "$amount" }
                }
            }
        ]);

        // 🔥 3. MERGE BOTH (IMPORTANT PART)

        const resultMap = {};

        // add inflow
        inflowByDate.forEach(item => {
            const date = item._id.date;
            resultMap[date] = {
                date,
                inflow: item.inflow,
                outflow: 0
            };
        });

        // add outflow
        outflowByDate.forEach(item => {
            const date = item._id.date;

            if (!resultMap[date]) {
                resultMap[date] = {
                    date,
                    inflow: 0,
                    outflow: item.outflow
                };
            } else {
                resultMap[date].outflow = item.outflow;
            }
        });


        // 🔥 4. CALCULATE NET
        const finalData = Object.values(resultMap).map(item => ({
            ...item,
            netCashFlow: item.inflow - item.outflow
        }));

        // 🔥 5. SORT BY DATE
        finalData.sort((a, b) => new Date(a.date) - new Date(b.date));

        // 🔥 TOTALS (same as before)   

        const totalInflow = finalData.reduce((sum, i) => sum + i.inflow, 0);
        const totalOutflow = finalData.reduce((sum, i) => sum + i.outflow, 0);
        const netCashFlow = totalInflow - totalOutflow;


        // get top products




        const topProducts = await Invoice.aggregate([
            { $match: filter },
            { $unwind: "$product" },
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt"
                            }
                        },
                        productId: "$product.productId"
                    },
                    totalSales: { $sum: "$product.total" },
                    quantity: { $sum: "$product.quantity" }
                }
            },
            { $sort: { "_id.date": 1, totalSales: -1 } },

            { $limit: 10 },

            {
                $lookup: {
                    from: "products",
                    localField: "_id.productId",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },

            { $unwind: "$productInfo" },
            {
                $project: {
                    _id: 0,
                    date: "$_id.date",
                    productId: "$_id.productId",
                    name: "$productInfo.name",
                    totalSales: 1,
                    quantity: 1
                }
            }

        ])


        res.status(200).json({
            success: true,
            totals: {
                totalInflow,
                totalOutflow,
                netCashFlow
            },
            trend: finalData, // 👈 THIS IS FOR YOUR CHART
            topProducts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export { handleGetDashboardSummary };