import mongoose from "mongoose";
import { Invoice } from "../models/Invoice.model.js";
import { Outflow } from "../models/Outflow.model.js";

const PRODUCT_COLORS = [
    "#2563eb",
    "#16a34a",
    "#f97316",
    "#dc2626",
    "#7c3aed",
    "#0891b2",
    "#ca8a04",
    "#db2777",
    "#4f46e5",
    "#0f766e",
];

const parseIdList = (value) => {
    if (!value) {
        return [];
    }

    const values = Array.isArray(value)
        ? value.flatMap((entry) => String(entry).split(","))
        : String(value).split(",");

    return values
        .map((entry) => entry.trim())
        .filter(Boolean)
        .filter((entry) => mongoose.Types.ObjectId.isValid(entry))
        .map((entry) => new mongoose.Types.ObjectId(entry));
};

const getStartOfDay = (value) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
};

const getEndOfDay = (value) => {
    const date = new Date(value);
    date.setHours(23, 59, 59, 999);
    return date;
};

const getGranularity = (startDate, endDate) => {
    if (!startDate || !endDate) {
        return "month";
    }

    const dayDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return dayDifference <= 60 ? "day" : "month";
};

const getPeriodIdentity = (value, granularity) => {
    const date = new Date(value);

    if (granularity === "day") {
        return {
            key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
            label: date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
            sortDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        };
    }

    return {
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
        label: date.toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
        sortDate: new Date(date.getFullYear(), date.getMonth(), 1),
    };
};

const getProductIdentifier = (entry) => {
    if (entry.productId) {
        return entry.productId.toString();
    }

    return `name:${entry.productName}`;
};

const handleGetDashboardSummary = async (req, res) => {
    try {
        const { startDate, endDate, products, customers } = req.query;

        const productIds = parseIdList(products);
        const customerIds = parseIdList(customers);

        const invoiceMatchStage = {};

        if (productIds.length > 0) {
            invoiceMatchStage["product.productId"] = { $in: productIds };
        }

        if (customerIds.length > 0) {
            invoiceMatchStage.customerId = { $in: customerIds };
        }

        if (startDate || endDate) {
            invoiceMatchStage.itemDate = {};

            if (startDate) {
                invoiceMatchStage.itemDate.$gte = getStartOfDay(startDate);
            }

            if (endDate) {
                invoiceMatchStage.itemDate.$lte = getEndOfDay(endDate);
            }
        }

        const salesEntries = await Invoice.aggregate([
            {
                $unwind: {
                    path: "$product",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $addFields: {
                    itemDate: {
                        $ifNull: ["$product.soldAt", "$createdAt"],
                    },
                },
            },
            ...(Object.keys(invoiceMatchStage).length > 0 ? [{ $match: invoiceMatchStage }] : []),
            {
                $project: {
                    _id: 0,
                    customerId: 1,
                    customerName: "$customer",
                    productId: "$product.productId",
                    productName: "$product.product",
                    qty: "$product.qty",
                    total: "$product.total",
                    date: "$itemDate",
                },
            },
            {
                $sort: {
                    date: 1,
                },
            },
        ]);

        const outflowQuery = {};

        if (startDate || endDate) {
            outflowQuery.date = {};

            if (startDate) {
                outflowQuery.date.$gte = getStartOfDay(startDate);
            }

            if (endDate) {
                outflowQuery.date.$lte = getEndOfDay(endDate);
            }
        }

        const outflows = await Outflow.find(outflowQuery).sort({ date: 1 }).lean();

        const normalizedSalesEntries = salesEntries.map((entry) => ({
            ...entry,
            qty: Number(entry.qty) || 0,
            total: Number(entry.total) || 0,
            date: new Date(entry.date),
        }));

        const normalizedOutflows = outflows.map((outflow) => ({
            ...outflow,
            amount: Number(outflow.amount) || 0,
            date: new Date(outflow.date),
        }));

        const totalInflow = normalizedSalesEntries.reduce((sum, entry) => sum + entry.total, 0);
        const totalOutflow = normalizedOutflows.reduce((sum, outflow) => sum + outflow.amount, 0);
        const netCashFlow = totalInflow - totalOutflow;

        const rangeStart = startDate ? getStartOfDay(startDate) : normalizedSalesEntries[0]?.date || normalizedOutflows[0]?.date || null;
        const rangeEnd = endDate ? getEndOfDay(endDate) : normalizedSalesEntries.at(-1)?.date || normalizedOutflows.at(-1)?.date || null;
        const granularity = getGranularity(rangeStart, rangeEnd);

        const cashFlowMap = new Map();

        normalizedSalesEntries.forEach((entry) => {
            const period = getPeriodIdentity(entry.date, granularity);
            const existing = cashFlowMap.get(period.key) || {
                key: period.key,
                label: period.label,
                sortDate: period.sortDate,
                inflow: 0,
                outflow: 0,
            };

            existing.inflow += entry.total;
            cashFlowMap.set(period.key, existing);
        });

        normalizedOutflows.forEach((entry) => {
            const period = getPeriodIdentity(entry.date, granularity);
            const existing = cashFlowMap.get(period.key) || {
                key: period.key,
                label: period.label,
                sortDate: period.sortDate,
                inflow: 0,
                outflow: 0,
            };

            existing.outflow += entry.amount;
            cashFlowMap.set(period.key, existing);
        });

        const cashFlowTrend = Array.from(cashFlowMap.values())
            .sort((a, b) => a.sortDate - b.sortDate)
            .map(({ key, label, inflow, outflow }) => ({
                key,
                label,
                inflow,
                outflow,
            }));

        const topProductsMap = new Map();

        normalizedSalesEntries.forEach((entry) => {
            const identifier = getProductIdentifier(entry);
            const existing = topProductsMap.get(identifier) || {
                productId: entry.productId ? entry.productId.toString() : null,
                name: entry.productName,
                sales: 0,
                qty: 0,
            };

            existing.sales += entry.total;
            existing.qty += entry.qty;
            topProductsMap.set(identifier, existing);
        });

        const topProducts = Array.from(topProductsMap.values())
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 10);

        const topCustomersMap = new Map();

        normalizedSalesEntries.forEach((entry) => {
            const identifier = entry.customerId?.toString() || entry.customerName;
            const existing = topCustomersMap.get(identifier) || {
                customerId: entry.customerId ? entry.customerId.toString() : null,
                name: entry.customerName,
                sales: 0,
                qty: 0,
            };

            existing.sales += entry.total;
            existing.qty += entry.qty;
            topCustomersMap.set(identifier, existing);
        });

        const topCustomers = Array.from(topCustomersMap.values())
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 10);

        const productSeries = topProducts.map((product, index) => ({
            key: `product_${index}`,
            name: product.name,
            color: PRODUCT_COLORS[index % PRODUCT_COLORS.length],
            productId: product.productId,
        }));

        const productSeriesLookup = new Map(
            topProducts.map((product, index) => [
                product.productId || `name:${product.name}`,
                `product_${index}`,
            ])
        );

        const productTrendMap = new Map();

        normalizedSalesEntries.forEach((entry) => {
            const identifier = getProductIdentifier(entry);
            const seriesKey = productSeriesLookup.get(identifier);

            if (!seriesKey) {
                return;
            }

            const period = getPeriodIdentity(entry.date, granularity);
            const existing = productTrendMap.get(period.key) || {
                key: period.key,
                label: period.label,
                sortDate: period.sortDate,
            };

            existing[seriesKey] = (existing[seriesKey] || 0) + entry.total;
            productTrendMap.set(period.key, existing);
        });

        const productTrend = Array.from(productTrendMap.values())
            .sort((a, b) => a.sortDate - b.sortDate)
            .map((entry) => {
                const normalizedEntry = {
                    key: entry.key,
                    label: entry.label,
                };

                productSeries.forEach((series) => {
                    normalizedEntry[series.key] = entry[series.key] || 0;
                });

                return normalizedEntry;
            });

        return res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalInflow,
                    totalOutflow,
                    netCashFlow,
                },
                cashFlowTrend,
                productTrend,
                productSeries,
                topProducts,
                topCustomers,
                granularity,
            },
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
};

export { handleGetDashboardSummary };
