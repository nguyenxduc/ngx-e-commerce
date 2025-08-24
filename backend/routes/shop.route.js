import express from "express";
import {
  createShop,
  getAllShops,
  getPendingShops,
  approveShop,
  rejectShop,
  suspendShop,
  reactivateShop,
  getShopById,
  updateShop,
  deleteShop,
  getShopProducts,
  toggleFollowShop,
} from "../controllers/shop.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { adminRoute } from "../middleware/admin.middleware.js";
import { shopOwnerRoute } from "../middleware/shopOwner.middleware.js";
const router = express.Router();

// Admin routes
router.get("/admin/all", protectRoute, adminRoute, getAllShops);
router.get("/admin/pending", protectRoute, adminRoute, getPendingShops);
router.patch("/admin/:id/approve", protectRoute, adminRoute, approveShop);
router.patch("/admin/:id/reject", protectRoute, adminRoute, rejectShop);
router.patch("/admin/:id/suspend", protectRoute, adminRoute, suspendShop);
router.patch("/admin/:id/reactivate", protectRoute, adminRoute, reactivateShop);

// Public routes
router.get("/", getAllShops);
router.get("/:id", getShopById);
router.get("/:id/products", getShopProducts);

// Protected routes
router.post("/", protectRoute, createShop);
router.put("/:id", protectRoute, shopOwnerRoute, updateShop);
router.delete("/:id", protectRoute, shopOwnerRoute, deleteShop);
router.post("/:id/follow", protectRoute, toggleFollowShop);

export default router;
