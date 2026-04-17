import { Router } from "express";
import { verifyAdmin } from "../middlware/adminMiddleware.js";
import { handleGetDashboardSummary } from "../controllers/dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get("/summary", verifyAdmin, handleGetDashboardSummary);

export { dashboardRouter };
