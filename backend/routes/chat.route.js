import express from "express";
import {
  getChat,
  sendMessage,
  getChatMessages,
  getUserChats,
  deleteChat,
} from "../controllers/chat.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

// Customer routes
router.get("/user", getUserChats);
router.get("/:chatId", getChat);
router.get("/:chatId/messages", getChatMessages);
router.post("/:chatId/messages", sendMessage);
router.delete("/:chatId", deleteChat);

export default router;
