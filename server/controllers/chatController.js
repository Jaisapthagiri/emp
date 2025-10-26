import User from "../models/User.js";
import Message from "../models/Message.js";
import { io, userSocketMap } from "../socketStore.js";

// GET -  http://localhost:4000/api/chat/users

export const getUsersForSideBar = async (req, res) => {
    try {
        const userId = req.user._id;

        let filteredUsers;
        if (req.user.role === "admin") {
            filteredUsers = await User.find({ role: "employee" }).select("-password");
        } else {
            filteredUsers = await User.find({ role: "admin" }).select("-password");
        }

        const unseenMessage = {};

        await Promise.all(
            filteredUsers.map(async (user) => {
                const messages = await Message.find({
                    senderId: user._id,
                    receiverId: userId,
                    seen: false,
                });
                if (messages.length > 0) unseenMessage[user._id] = messages.length;
            })
        );

        res.json({ success: true, users: filteredUsers, unseenMessage });
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// GET -  http://localhost:4000/api/chat/messages/:id

export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ],
        }).sort({ createdAt: 1 });

        await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true });

        res.json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching messages:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// PATCH -  http://localhost:4000/api/chat/messages/seen/:id

export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true });
    } catch (error) {
        console.error("Error marking message seen:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// POST -  http://localhost:4000/api/chat/messages/send/:id

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.id;
        const { text } = req.body;

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            senderRole: req.user.role,
            receiverRole: (await User.findById(receiverId)).role,
        });

        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.json({ success: true, newMessage });
    } catch (error) {
        console.error("Error sending message:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// ------------------- EMIT TASK STATUS UPDATES -------------------
export const emitTaskUpdate = async (task) => {
    try {
        const assignedToId = task.assignedTo.toString();
        const assignedSocketId = userSocketMap[assignedToId];
        if (assignedSocketId) {
            io.to(assignedSocketId).emit("taskUpdated", task);
        }
    } catch (error) {
        console.error("Error emitting task update:", error.message);
    }
};
