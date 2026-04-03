import { Router } from "express";
import {  checkingAdminAuth, loginUser, refreshAccessToken } from "../controllers/user.auth.controller.js";
import { verifyAdmin } from "../middlware/adminMiddleware.js";
export const adminAuthRouter = Router()



adminAuthRouter.post('/login',loginUser)
adminAuthRouter.get('/check',verifyAdmin, checkingAdminAuth)
adminAuthRouter.post('/refresh-admin-access-token', refreshAccessToken)



