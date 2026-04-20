    import { Invoice } from "../models/Invoice.model.js";
    const getDateRange = (range) => {
        const now = new Date();
        let startDate, endDate = new Date();

        switch (range) {
            case "Today":
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
                break;

            case "Last 7 Days":
                startDate = new Date();
                startDate.setDate(now.getDate() - 7);
                endDate = new Date();
                break;

            case "Last 30 Days":
                startDate = new Date();
                startDate.setDate(now.getDate() - 30);
                endDate = new Date();
                break;

            case "This Month":
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(); // today
                break;

            case "Last Month":
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0); // last day of last month
                break;

            case "Last 3 Months":
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                endDate = new Date(); // ✅ today, not end of last month
                break;

            case "Last 6 Months":
                startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
                endDate = new Date(); // ✅ today
                break;

            case "Last 9 Months":
                startDate = new Date(now.getFullYear(), now.getMonth() - 9, 1);
                endDate = new Date(); // ✅ today
                break;

            case "Last 12 Months":
                startDate = new Date(now.getFullYear(), now.getMonth() - 12, 1);
                endDate = new Date(); // ✅ today
                break;

            case "This year":
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(); // today
                break;

            case "Last year":
                startDate = new Date(now.getFullYear() - 1, 0, 1);
                endDate = new Date(now.getFullYear() - 1, 11, 31);
                break;

            case "All Time":
                startDate = null;
                endDate = null;
                break;

            default:
                startDate = null;
                endDate = null;
        }

        return { startDate, endDate };
    };



    const handleGetDashboardSummary = async (req, res) => {
    try {
        const { range, startDate, endDate, products, customers } = req.body;
        let filter = {};
        // 1. Handle date filtering
        let dateFilter = {};
        if (range && range !== "All Time") {
        const dates = getDateRange(range);
        if (dates.startDate) {
            dateFilter.$gte = dates.startDate;
            dateFilter.$lte = dates.endDate;
        }
        }
        // Override if custom range selected
        if (startDate && endDate) {
        dateFilter = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
        }
        if (Object.keys(dateFilter).length > 0) {
        filter.createdAt = dateFilter;
        }


        // 2. Product filter
        if (products && products.length > 0) {
        filter.product = { $in: products };
        }
        // 3. Customer filter
        if (customers && customers.length > 0) {
        filter.customer = { $in: customers };
        }
        // 4. Query database
        const data = await Invoice.find(filter);
        res.status(200).json({
        success: true,
        data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
    };


    export {handleGetDashboardSummary}