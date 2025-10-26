import express from "express";
import { login, getMyTasks, updateMyTask } from "../controllers/employeeController.js";
import { protect, employeeOnly } from "../middleware/authUser.js";

const employeeRouter = express.Router();

employeeRouter.post("/login", login);
employeeRouter.get("/tasks", protect, employeeOnly, getMyTasks);
employeeRouter.patch("/tasks/:taskId", protect, employeeOnly, updateMyTask);

export default employeeRouter;
