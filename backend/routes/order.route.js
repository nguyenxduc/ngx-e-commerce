import express from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
} from "../controllers/order.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Tạo đơn hàng mới
router.post("/", protectRoute, createOrder);

// Lấy tất cả đơn hàng của user hiện tại
router.get("/user/orders", protectRoute, getUserOrders);

// Lấy đơn hàng theo ID
router.get("/:id", protectRoute, getOrderById);

// Lấy tất cả đơn hàng (admin only)
router.get("/", protectRoute, adminRoute, getAllOrders);

// Cập nhật trạng thái đơn hàng (admin only)
router.patch("/:id/status", protectRoute, adminRoute, updateOrderStatus);

// Xóa đơn hàng (admin only)
router.delete("/:id", protectRoute, adminRoute, deleteOrder);

// Thống kê đơn hàng (admin only)
router.get("/stats/overview", protectRoute, adminRoute, getOrderStats);

export default router;
