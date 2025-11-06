import express from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
  getOrderStats,
} from "../controllers/order.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// User routes
router.post("/", protectRoute, createOrder);
router.get("/user/orders", protectRoute, getUserOrders);
router.get("/:id", protectRoute, getOrderById);
router.patch("/:id/cancel", protectRoute, cancelOrder);

// Admin routes
router.get("/", protectRoute, adminRoute, getAllOrders);
router.patch("/:id/update_status", protectRoute, adminRoute, updateOrderStatus);
router.get("/stats", protectRoute, adminRoute, getOrderStats);
router.delete("/:id", protectRoute, adminRoute, deleteOrder);

export default router;
