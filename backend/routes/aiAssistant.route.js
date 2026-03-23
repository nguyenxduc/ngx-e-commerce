import express from "express";
import {
  listAiChats,
  createAiChat,
  getAiMessages,
  sendAiChatMessage,
  deleteAiChat,
} from "../controllers/aiAssistant.controller.js";
import {
  createAiFeedback,
  getAiFeedbackStats,
} from "../controllers/aiFeedback.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, listAiChats);
router.post("/", protectRoute, createAiChat);
router.get("/:chatId/messages", protectRoute, getAiMessages);
router.post("/:chatId/messages", protectRoute, sendAiChatMessage);
router.delete("/:chatId", protectRoute, deleteAiChat);

// Feedback cho câu trả lời của bot
router.post("/:chatId/feedback", protectRoute, createAiFeedback);
// Admin có thể xem thống kê tổng quan
router.get("/feedback/stats", protectRoute, getAiFeedbackStats);

export default router;

