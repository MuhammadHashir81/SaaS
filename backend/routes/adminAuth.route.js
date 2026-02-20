import { Router } from "express";
import { adminAuth, checkingAdminAuth, refreshAccessToken } from "../controllers/adminAuthController.js";
import { verifyAdmin } from "../middlware/adminMiddleware.js";
export const adminAuthRouter = Router()



adminAuthRouter.post('/login',adminAuth)
adminAuthRouter.post('/check',verifyAdmin, checkingAdminAuth)
adminAuthRouter.post('/refresh-admin-access-token', verifyAdmin ,refreshAccessToken)



