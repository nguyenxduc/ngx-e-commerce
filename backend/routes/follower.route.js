import express from "express";
import {
  follow,
  unfollow,
  getUserFollows,
  getShopFollowers,
  checkFollowStatus,
} from "../controllers/follower.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected routes
router.post("/follow", protectRoute, follow);
router.post("/unfollow", protectRoute, unfollow);
router.get("/user", protectRoute, getUserFollows);
router.get("/shop/:shopId", protectRoute, getShopFollowers);
router.get("/check", protectRoute, checkFollowStatus);

export default router;
