import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Task from "../models/Task.js";
import { io, userSocketMap } from '../socketStore.js'

// POST -  http://localhost:4000/api/admin/login

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, role: "admin" });
        if (!user) return res.status(404).json({ message: "Admin not found" });

        const isMatch = await user.matchPassword(password); // bcrypt compare
        if (!isMatch) return res.status(401).json({ message: "Invalid admin credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(200).json({ message: "Admin login successful", token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// POST - http://localhost:4000/api/admin/employee/create

export const createEmployee = async (req, res) => {
    try {
        const { name, email, password, position, department } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Employee already exists" });
        }

        const employee = await User.create({
            name,
            email,
            password,
            role: "employee",
            position,
            department,
        });

        res.status(201).json({ message: "Employee created successfully", employee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


//  GET - http://localhost:4000/api/admin/employee

export const findEmployee = async (req, res) => {
    try {
        const employees = await User.find({ role: "employee" }).select(
            "-password"
        );
        res.status(200).json({ employees });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

//  GET - http://localhost:4000/api/admin/employee/68fb00b5d1c07f2461c6cf66

export const findEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await User.findById(id).select("-password");
        if (!employee || employee.role !== "employee") {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Fetch tasks assigned to this employee
        const tasks = await Task.find({ assignedTo: id });

        res.status(200).json({ ...employee.toObject(), tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// POST - http://localhost:4000/api/admin/task/assign

export const assignTask = async (req, res) => {
    try {
        const { employeeId, title, description, dueDate } = req.body;

        const employee = await User.findById(employeeId);
        if (!employee || employee.role !== "employee") {
            return res.status(404).json({ message: "Employee not found" });
        }

        const task = await Task.create({
            title,
            description,
            assignedTo: employee._id,
            createdBy: req.user._id,
            dueDate,
        });

        res.status(201).json({ message: "Task assigned", task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET - http://localhost:4000/api/admin/view-task

export const viewTask = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email role");
        res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// PATCH - http://localhost:4000/api/admin/task/<id>/status

export const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        const task = await Task.findById(taskId).populate("assignedTo");
        if (!task) return res.status(404).json({ message: "Task not found" });

        task.status = status;
        await task.save();

        const assignedSocketId = userSocketMap[task.assignedTo._id];
        if (assignedSocketId) {
            io.to(assignedSocketId).emit("taskUpdated", task);
        }

        res.status(200).json({ message: "Task status updated", task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE - http://localhost:4000/api/admin/employee/<id>

export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await User.findById(id);
        if (!employee || employee.role !== "employee") {
            return res.status(404).json({ message: "Employee not found" });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
