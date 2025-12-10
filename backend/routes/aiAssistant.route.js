import express from "express";
import {
  listAiChats,
  createAiChat,
  getAiMessages,
  sendAiChatMessage,
  deleteAiChat,
} from "../controllers/aiAssistant.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, listAiChats);
router.post("/", protectRoute, createAiChat);
router.get("/:chatId/messages", protectRoute, getAiMessages);
router.post("/:chatId/messages", protectRoute, sendAiChatMessage);
router.delete("/:chatId", protectRoute, deleteAiChat);

export default router;

