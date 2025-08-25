import express from "express";
import {
  getChat,
  sendMessage,
  getChatMessages,
  getUserChats,
  deleteChat,
  deleteMessage,
  updateMessage,
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
router.delete("/:chatId/messages/:messageId", deleteMessage);
router.put("/:chatId/messages/:messageId", updateMessage);

export default router;
