import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
  getSellerProducts,
  getSellerStats,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute, sellerOrAdminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.get("/:id", getProductById);

// Seller routes
router.get("/seller/products", protectRoute, sellerOrAdminRoute, getSellerProducts);
router.get("/seller/stats", protectRoute, sellerOrAdminRoute, getSellerStats);

// Admin/Seller routes
router.post("/", protectRoute, sellerOrAdminRoute, createProduct);
router.put("/:id", protectRoute, sellerOrAdminRoute, updateProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, sellerOrAdminRoute, deleteProduct);

export default router;
