import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getHomeRecommendations } from "../controllers/recommendation.controller.js";

const router = express.Router();

// Gợi ý cho trang chủ – cần bảo vệ nhẹ để có userId khi có (nhưng vẫn có thể dùng sessionId cho khách)
router.get("/home", protectRoute, getHomeRecommendations);

export default router;

