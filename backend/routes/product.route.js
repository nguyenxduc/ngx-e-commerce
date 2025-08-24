import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  getProductsByShop,
  uploadProductImages,
  deleteProductImage,
} from "../controllers/product.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { productOwnerRoute } from "../middleware/shopOwner.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/shop/:shopId", getProductsByShop);
router.get("/:id", getProductById);

// Protected routes - require authentication and product ownership
router.post("/", protectRoute, createProduct);
router.put("/:id", protectRoute, productOwnerRoute, updateProduct);
router.delete("/:id", protectRoute, productOwnerRoute, deleteProduct);
router.post(
  "/:id/images",
  protectRoute,
  productOwnerRoute,
  uploadProductImages
);
router.delete(
  "/:id/images/:imageId",
  protectRoute,
  productOwnerRoute,
  deleteProductImage
);

export default router;
