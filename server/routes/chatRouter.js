import express from "express";
import { getUsersForSideBar, getMessages, markMessageAsSeen, sendMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/authUser.js";

const chatRouter = express.Router();

chatRouter.get("/users", protect, getUsersForSideBar);
chatRouter.get("/messages/:id", protect, getMessages);
chatRouter.patch("/messages/seen/:id", protect, markMessageAsSeen);
chatRouter.post("/send/:id", protect, sendMessage);

export default chatRouter;
