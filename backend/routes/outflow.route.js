import { Router } from "express";
import { verifyAdmin } from "../middlware/adminMiddleware.js";
import { handleAddOutflow, handleDeleteOutflow, handleGetAllOutflows } from "../controllers/outflow.controller.js";

const outflowRouter = Router();

outflowRouter.post("/add", verifyAdmin, handleAddOutflow);
outflowRouter.get("/get-all", verifyAdmin, handleGetAllOutflows);
outflowRouter.delete("/delete/:id", verifyAdmin, handleDeleteOutflow);

export { outflowRouter };
