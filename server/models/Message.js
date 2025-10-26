import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    seen: { type: Boolean, default: false }
}, { timestamps: true });

messageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);
