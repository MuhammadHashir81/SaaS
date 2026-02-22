import { Router } from "express";
import {  checkingAdminAuth, loginUser, refreshAccessToken } from "../controllers/user.auth.controller.js";
import { verifyAdmin } from "../middlware/adminMiddleware.js";
export const adminAuthRouter = Router()



adminAuthRouter.post('/login',loginUser)
adminAuthRouter.post('/check',verifyAdmin, checkingAdminAuth)
adminAuthRouter.post('/refresh-admin-access-token', verifyAdmin ,refreshAccessToken)



