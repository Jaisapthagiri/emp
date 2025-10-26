import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "redo", "in-progress", "completed"], default: "pending" },
    dueDate: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
