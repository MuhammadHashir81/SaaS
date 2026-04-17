import { Outflow } from "../models/Outflow.model.js";

const buildDateQuery = (startDate, endDate) => {
    const dateQuery = {};

    if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        dateQuery.$gte = start;
    }

    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateQuery.$lte = end;
    }

    return dateQuery;
};

const handleAddOutflow = async (req, res) => {
    try {
        const { date, category, description, amount } = req.body;

        if (!date || !category || amount === undefined || amount === "") {
            return res.status(400).json({
                success: false,
                error: "date, category and amount are required",
            });
        }

        const parsedAmount = Number(amount);

        if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
            return res.status(400).json({
                success: false,
                error: "amount must be a valid positive number",
            });
        }

        const outflow = await Outflow.create({
            date,
            category,
            description,
            amount: parsedAmount,
        });

        return res.status(201).json({
            success: true,
            message: "Outflow added successfully",
            data: outflow,
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
};

const handleGetAllOutflows = async (req, res) => {
    try {
        const { q = "", startDate, endDate, category = "" } = req.query;

        const query = {};
        const search = q.trim();
        const categoryValue = category.trim();

        if (search) {
            query.$or = [
                { category: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        if (categoryValue) {
            query.category = categoryValue.toLowerCase();
        }

        const dateQuery = buildDateQuery(startDate, endDate);
        if (Object.keys(dateQuery).length > 0) {
            query.date = dateQuery;
        }

        const outflows = await Outflow.find(query).sort({ date: -1, createdAt: -1 });
        const totalAmount = outflows.reduce((sum, outflow) => sum + (outflow.amount || 0), 0);

        return res.status(200).json({
            success: true,
            count: outflows.length,
            totalAmount,
            data: outflows,
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
};

const handleDeleteOutflow = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedOutflow = await Outflow.findByIdAndDelete(id);

        if (!deletedOutflow) {
            return res.status(404).json({
                success: false,
                error: "Outflow does not exist",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Outflow deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
};

export { handleAddOutflow, handleDeleteOutflow, handleGetAllOutflows };
