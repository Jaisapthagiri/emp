import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Task from "../models/Task.js";
import { io, userSocketMap } from "../socketStore.js";

// POST - http://localhost:4000/api/employee/login

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || user.role !== "employee") {
            return res.status(404).json({ message: "Employee not found" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Employee login successful",
            token,
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET - http://localhost:4000/api/employee/tasks

export const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id });

        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// PATCH - http://localhost:4000/api/employee/tasks/68fa4f1eaa5eb545bd8f45a6

export const updateMyTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        if (!["in-progress", "completed"].includes(status)) {
            return res.status(400).json({
                message: "Employees can only update status to in-progress or completed",
            });
        }

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not allowed to update this task" });
        }

        task.status = status;
        await task.save();

        const adminSocketId = userSocketMap[task.createdBy];
        if (adminSocketId) {
            io.to(adminSocketId).emit("taskUpdated", task);
        }

        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
