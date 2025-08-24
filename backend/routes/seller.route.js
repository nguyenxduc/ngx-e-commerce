import express from "express";
import {
  getSellerProfile,
  updateSellerProfile,
  getSellerOrders,
  getSellerProducts,
  getSellerReviews,
} from "../controllers/seller.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { sellerRoute } from "../middleware/shopOwner.middleware.js";

const router = express.Router();

// All routes require authentication and seller privileges
router.use(protectRoute, sellerRoute);

// Profile and settings
router.get("/profile", getSellerProfile);
router.put("/profile", updateSellerProfile);

// Orders management
router.get("/orders", getSellerOrders);

// Products management
router.get("/products", getSellerProducts);

// Reviews
router.get("/reviews", getSellerReviews);

export default router;
