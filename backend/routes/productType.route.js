import express from "express";
import {
  getAllProductTypes,
  getProductTypeById,
  createProductType,
  updateProductType,
  deleteProductType,
  getActiveProductTypes,
} from "../controllers/productType.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProductTypes);
router.get("/active", getActiveProductTypes);
router.get("/:id", getProductTypeById);

// Admin routes
router.post("/", protectRoute, adminRoute, createProductType);
router.put("/:id", protectRoute, adminRoute, updateProductType);
router.delete("/:id", protectRoute, adminRoute, deleteProductType);

export default router;
