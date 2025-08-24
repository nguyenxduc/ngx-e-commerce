import express from "express";
import {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
  getAllReviews,
} from "../controllers/review.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/product/:productId", getReviewsByProduct);

// Protected routes
router.post("/", protectRoute, createReview);
router.put("/:id", protectRoute, updateReview);
router.delete("/:id", protectRoute, deleteReview);

// Admin routes
router.get("/", protectRoute, adminRoute, getAllReviews);

export default router;
