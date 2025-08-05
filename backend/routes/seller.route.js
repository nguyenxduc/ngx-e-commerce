import express from "express";
import {
  getSellerOrders,
  getSellerSalesStats,
  getSellerReviews,
  updateSellerOrderStatus,
} from "../controllers/seller.controller.js";
import { protectRoute, sellerOrAdminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Lấy đơn hàng của seller
router.get("/orders", protectRoute, sellerOrAdminRoute, getSellerOrders);

// Thống kê bán hàng của seller
router.get("/sales-stats", protectRoute, sellerOrAdminRoute, getSellerSalesStats);

// Lấy feedback của seller
router.get("/reviews", protectRoute, sellerOrAdminRoute, getSellerReviews);

// Cập nhật trạng thái đơn hàng của seller
router.patch("/orders/:orderId/status", protectRoute, sellerOrAdminRoute, updateSellerOrderStatus);

export default router; 