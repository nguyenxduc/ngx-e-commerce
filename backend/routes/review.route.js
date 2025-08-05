import express from "express";
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getUserReviews,
} from "../controllers/review.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Lấy tất cả review của một sản phẩm
router.get("/product/:productId", getProductReviews);

// Lấy tất cả review của user hiện tại
router.get("/user", protectRoute, getUserReviews);

// Tạo review mới
router.post("/", protectRoute, createReview);

// Cập nhật review
router.put("/:id", protectRoute, updateReview);

// Xóa review (chỉ admin hoặc chủ review)
router.delete("/:id", protectRoute, deleteReview);

export default router; 