import express from "express";
import { adminLogin, createEmployee, findEmployee, findEmployeeById, assignTask, viewTask, updateTaskStatus, deleteEmployee } from "../controllers/adminController.js";

import { protect, adminOnly } from "../middleware/authUser.js";
const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/employee/create", protect, adminOnly, createEmployee);
adminRouter.get("/employee", protect, adminOnly, findEmployee);
adminRouter.get("/employee/:id", protect, adminOnly, findEmployeeById);
adminRouter.delete("/employee/:id", protect, adminOnly, deleteEmployee);
adminRouter.post("/task/assign", protect, adminOnly, assignTask);
adminRouter.get("/view-task", protect, adminOnly, viewTask);
adminRouter.patch("/task/:taskId/status", protect, adminOnly, updateTaskStatus);

export default adminRouter;
