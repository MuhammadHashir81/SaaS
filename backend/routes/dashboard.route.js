import { Router } from "express";
import { verifyAdmin } from "../middlware/adminMiddleware.js";
import {
    handleGetDashboardSummary,
    handleGetTopCustomers,
    handleGetTopProducts,
} from "../controllers/dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.post("/summary", verifyAdmin, handleGetDashboardSummary);
dashboardRouter.post("/top-products", verifyAdmin, handleGetTopProducts);
dashboardRouter.post("/top-customers", verifyAdmin, handleGetTopCustomers);

export { dashboardRouter };
