import mongoose from "mongoose";
import { Invoice } from "../models/Invoice.model.js";
import { Outflow } from "../models/Outflow.model.js";

const DEFAULT_RANGE = "Last 30 Days";
const DAILY_RANGES = [
    "Today",
    "This Week",
    "Last Week",
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
    "Last Month",
];

const startOfDay = (date) => {
    const value = new Date(date);
    value.setHours(0, 0, 0, 0);
    return value;
};

const endOfDay = (date) => {
    const value = new Date(date);
    value.setHours(23, 59, 59, 999);
    return value;
};

const startOfMonth = (date) => {
    const value = new Date(date);
    value.setDate(1);
    value.setHours(0, 0, 0, 0);
    return value;
};

const endOfMonth = (date) => {
    const value = startOfMonth(date);
    value.setMonth(value.getMonth() + 1);
    value.setDate(0);
    value.setHours(23, 59, 59, 999);
    return value;
};

const addDays = (date, days) => {
    const value = new Date(date);
    value.setDate(value.getDate() + days);
    return value;
};

const addMonths = (date, months) => {
    const value = new Date(date);
    value.setMonth(value.getMonth() + months);
    return value;
};

const startOfWeek = (date) => {
    const value = startOfDay(date);
    const day = value.getDay();
    const difference = day === 0 ? -6 : 1 - day;
    value.setDate(value.getDate() + difference);
    return value;
};

const endOfWeek = (date) => {
    const value = startOfWeek(date);
    value.setDate(value.getDate() + 6);
    return endOfDay(value);
};

const pad = (value) => String(value).padStart(2, "0");

const formatBucketKey = (date, bucketType) => {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);

    if (bucketType === "month") {
        return `${year}-${month}`;
    }

    const day = pad(date.getDate());
    return `${year}-${month}-${day}`;
};

const formatBucketLabel = (date, bucketType) => {
    if (bucketType === "month") {
        return date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
    });
};

const getDefaultDateRange = (range = DEFAULT_RANGE) => {
    const now = new Date();

    switch (range) {
        case "Today":
            return {
                startDate: startOfDay(now),
                endDate: endOfDay(now),
            };

        case "This Week":
            return {
                startDate: startOfWeek(now),
                endDate: endOfDay(now),
            };

        case "Last Week": {
            const lastWeekStart = addDays(startOfWeek(now), -7);
            return {
                startDate: lastWeekStart,
                endDate: endOfWeek(lastWeekStart),
            };
        }

        case "Last 7 Days":
            return {
                startDate: startOfDay(addDays(now, -6)),
                endDate: endOfDay(now),
            };

        case "Last 30 Days":
            return {
                startDate: startOfDay(addDays(now, -29)),
                endDate: endOfDay(now),
            };

        case "This Month":
            return {
                startDate: startOfMonth(now),
                endDate: endOfDay(now),
            };

        case "Last Month": {
            const lastMonth = addMonths(now, -1);
            return {
                startDate: startOfMonth(lastMonth),
                endDate: endOfMonth(lastMonth),
            };
        }

        case "Last 3 Months":
            return {
                startDate: startOfMonth(addMonths(now, -2)),
                endDate: endOfDay(now),
            };

        case "Last 6 Months":
            return {
                startDate: startOfMonth(addMonths(now, -5)),
                endDate: endOfDay(now),
            };

        case "Last 9 Months":
            return {
                startDate: startOfMonth(addMonths(now, -8)),
                endDate: endOfDay(now),
            };

        case "Last 12 Months":
            return {
                startDate: startOfMonth(addMonths(now, -11)),
                endDate: endOfDay(now),
            };

        case "This year":
            return {
                startDate: new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0),
                endDate: endOfDay(now),
            };

        case "Last year":
            return {
                startDate: new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0),
                endDate: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999),
            };

        case "All Time":
            return {
                startDate: null,
                endDate: null,
            };

        default:
            return getDefaultDateRange(DEFAULT_RANGE);
    }
};

const getAllTimeDateRange = async () => {
    const [
        firstInvoice,
        lastInvoice,
        firstOutflow,
        lastOutflow,
    ] = await Promise.all([
        Invoice.findOne({}, { createdAt: 1 }).sort({ createdAt: 1 }).lean(),
        Invoice.findOne({}, { createdAt: 1 }).sort({ createdAt: -1 }).lean(),
        Outflow.findOne({}, { date: 1 }).sort({ date: 1 }).lean(),
        Outflow.findOne({}, { date: 1 }).sort({ date: -1 }).lean(),
    ]);

    const startingDates = [
        firstInvoice?.createdAt,
        firstOutflow?.date,
    ].filter(Boolean);

    const endingDates = [
        lastInvoice?.createdAt,
        lastOutflow?.date,
    ].filter(Boolean);

    if (!startingDates.length || !endingDates.length) {
        return {
            startDate: null,
            endDate: null,
        };
    }

    startingDates.sort((a, b) => new Date(a) - new Date(b));
    endingDates.sort((a, b) => new Date(a) - new Date(b));

    return {
        startDate: startOfMonth(startingDates[0]),
        endDate: endOfDay(endingDates[endingDates.length - 1]),
    };
};

const resolveDateRange = async ({ range, startDate, endDate }) => {
    const selectedRange = range || DEFAULT_RANGE;
    const resolvedRange = getDefaultDateRange(selectedRange);
    let finalStartDate = resolvedRange.startDate;
    let finalEndDate = resolvedRange.endDate;

    if (startDate) {
        finalStartDate = startOfDay(startDate);
    }

    if (endDate) {
        finalEndDate = endOfDay(endDate);
    }

    if (finalStartDate && !finalEndDate) {
        finalEndDate = endOfDay(new Date());
    }

    if (!finalStartDate && finalEndDate) {
        finalStartDate = startOfDay(finalEndDate);
    }

    if (!finalStartDate && !finalEndDate) {
        const allTimeRange = await getAllTimeDateRange();
        finalStartDate = allTimeRange.startDate;
        finalEndDate = allTimeRange.endDate;
    }

    if (finalStartDate && finalEndDate && finalStartDate > finalEndDate) {
        const swappedStartDate = startOfDay(finalEndDate);
        finalEndDate = endOfDay(finalStartDate);
        finalStartDate = swappedStartDate;
    }

    return {
        startDate: finalStartDate,
        endDate: finalEndDate,
    };
};

const getBucketType = ({ range, startDate, endDate, hasCustomDates }) => {
    if (hasCustomDates && startDate && endDate) {
        const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
        const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24)) + 1;
        return differenceInDays > 31 ? "month" : "day";
    }

    return DAILY_RANGES.includes(range || DEFAULT_RANGE) ? "day" : "month";
};

const buildInvoiceMatch = ({ startDate, endDate, customerId }) => {
    const match = {};

    if (startDate || endDate) {
        match.createdAt = {};

        if (startDate) {
            match.createdAt.$gte = startDate;
        }

        if (endDate) {
            match.createdAt.$lte = endDate;
        }
    }

    if (customerId) {
        match.customerId = customerId;
    }

    return match;
};

const buildOutflowMatch = ({ startDate, endDate }) => {
    const match = {};

    if (startDate || endDate) {
        match.date = {};

        if (startDate) {
            match.date.$gte = startDate;
        }

        if (endDate) {
            match.date.$lte = endDate;
        }
    }

    return match;
};

const buildBuckets = ({ startDate, endDate, bucketType }) => {
    if (!startDate || !endDate) {
        return [];
    }

    const buckets = [];
    const currentDate = bucketType === "month" ? startOfMonth(startDate) : startOfDay(startDate);
    const lastDate = bucketType === "month" ? startOfMonth(endDate) : startOfDay(endDate);

    while (currentDate <= lastDate) {
        buckets.push({
            key: formatBucketKey(currentDate, bucketType),
            label: formatBucketLabel(currentDate, bucketType),
            inflow: 0,
            outflow: 0,
            netCashFlow: 0,
        });

        if (bucketType === "month") {
            currentDate.setMonth(currentDate.getMonth() + 1);
        } else {
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    return buckets;
};

const parseObjectId = (value, fieldName) => {
    if (!value) {
        return null;
    }

    if (!mongoose.Types.ObjectId.isValid(value)) {
        const error = new Error(`${fieldName} is invalid`);
        error.status = 400;
        throw error;
    }

    return new mongoose.Types.ObjectId(value);
};

const getDashboardContext = async (payload = {}) => {
    const selectedRange = payload.range || DEFAULT_RANGE;
    const hasCustomDates = Boolean(payload.startDate || payload.endDate);
    const productId = parseObjectId(payload.product, "product");
    const customerId = parseObjectId(payload.customer, "customer");
    const { startDate, endDate } = await resolveDateRange({
        range: selectedRange,
        startDate: payload.startDate ? new Date(payload.startDate) : null,
        endDate: payload.endDate ? new Date(payload.endDate) : null,
    });
    const bucketType = getBucketType({
        range: selectedRange,
        startDate,
        endDate,
        hasCustomDates,
    });

    return {
        range: selectedRange,
        startDate,
        endDate,
        bucketType,
        productId,
        customerId,
        invoiceMatch: buildInvoiceMatch({ startDate, endDate, customerId }),
        outflowMatch: buildOutflowMatch({ startDate, endDate }),
    };
};

const buildDateGroupFormat = (bucketType) => {
    return bucketType === "month" ? "%Y-%m" : "%Y-%m-%d";
};

const handleGetDashboardSummary = async (req, res) => {
    try {
        const context = await getDashboardContext(req.body);
        const groupFormat = buildDateGroupFormat(context.bucketType);

        const inflowPipeline = [
            { $match: context.invoiceMatch },
            { $unwind: "$product" },
        ];

        if (context.productId) {
            inflowPipeline.push({
                $match: {
                    "product.productId": context.productId,
                },
            });
        }

        inflowPipeline.push(
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: groupFormat,
                            date: "$createdAt",
                        },
                    },
                    inflow: {
                        $sum: { $ifNull: ["$product.total", 0] },
                    },
                },
            },
            { $sort: { _id: 1 } },
        );

        const outflowPipeline = [
            { $match: context.outflowMatch },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: groupFormat,
                            date: "$date",
                        },
                    },
                    outflow: {
                        $sum: { $ifNull: ["$amount", 0] },
                    },
                },
            },
            { $sort: { _id: 1 } },
        ];

        const [inflowResults, outflowResults] = await Promise.all([
            Invoice.aggregate(inflowPipeline),
            Outflow.aggregate(outflowPipeline),
        ]);

        const buckets = buildBuckets({
            startDate: context.startDate,
            endDate: context.endDate,
            bucketType: context.bucketType,
        });

        const bucketMap = new Map();

        buckets.forEach((bucket) => {
            bucketMap.set(bucket.key, bucket);
        });

        inflowResults.forEach((item) => {
            const bucket = bucketMap.get(item._id);

            if (bucket) {
                bucket.inflow = item.inflow;
            }
        });

        outflowResults.forEach((item) => {
            const bucket = bucketMap.get(item._id);

            if (bucket) {
                bucket.outflow = item.outflow;
            }
        });

        const trend = Array.from(bucketMap.values()).map((bucket) => ({
            ...bucket,
            netCashFlow: bucket.inflow - bucket.outflow,
        }));

        const totals = trend.reduce(
            (result, item) => {
                result.totalInflow += item.inflow;
                result.totalOutflow += item.outflow;
                result.netCashFlow += item.netCashFlow;
                return result;
            },
            {
                totalInflow: 0,
                totalOutflow: 0,
                netCashFlow: 0,
            },
        );

        return res.status(200).json({
            success: true,
            bucketType: context.bucketType,
            range: context.range,
            totals,
            trend,
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

const handleGetTopProducts = async (req, res) => {
    try {
        const context = await getDashboardContext(req.body);

        const pipeline = [
            { $match: context.invoiceMatch },
            { $unwind: "$product" },
        ];

        if (context.productId) {
            pipeline.push({
                $match: {
                    "product.productId": context.productId,
                },
            });
        }

        pipeline.push(
            {
                $group: {
                    _id: "$product.productId",
                    name: { $first: "$product.product" },
                    totalSales: {
                        $sum: { $ifNull: ["$product.total", 0] },
                    },
                    totalQuantity: {
                        $sum: { $ifNull: ["$product.qty", 0] },
                    },
                },
            },
            { $sort: { totalSales: -1, totalQuantity: -1, name: 1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productInfo",
                },
            },
            {
                $unwind: {
                    path: "$productInfo",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    name: {
                        $ifNull: ["$productInfo.name", "$name"],
                    },
                    totalSales: 1,
                    totalQuantity: 1,
                },
            },
        );

        const topProducts = await Invoice.aggregate(pipeline);

        return res.status(200).json({
            success: true,
            topProducts: topProducts,
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

const handleGetTopCustomers = async (req, res) => {
    try {
        const context = await getDashboardContext(req.body);

        const pipeline = [
            { $match: context.invoiceMatch },
            { $unwind: "$product" },
        ];

        if (context.productId) {
            pipeline.push({
                $match: {
                    "product.productId": context.productId,
                },
            });
        }

        pipeline.push(
            {
                $group: {
                    _id: "$customerId",
                    name: { $first: "$customer" },
                    totalSales: {
                        $sum: { $ifNull: ["$product.total", 0] },
                    },
                    totalQuantity: {
                        $sum: { $ifNull: ["$product.qty", 0] },
                    },
                    invoiceIds: { $addToSet: "$_id" },
                },
            },
            { $sort: { totalSales: -1, totalQuantity: -1, name: 1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "customers",
                    localField: "_id",
                    foreignField: "_id",
                    as: "customerInfo",
                },
            },
            {
                $unwind: {
                    path: "$customerInfo",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    customerId: "$_id",
                    name: {
                        $ifNull: ["$customerInfo.name", "$name"],
                    },
                    email: "$customerInfo.email",
                    phone: "$customerInfo.phone",
                    totalSales: 1,
                    totalQuantity: 1,
                    totalOrders: { $size: "$invoiceIds" },
                },
            },
        );

        const topCustomers = await Invoice.aggregate(pipeline);

        return res.status(200).json({
            success: true,
            data: topCustomers,
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

export {
    handleGetDashboardSummary,
    handleGetTopProducts,
    handleGetTopCustomers,
};
