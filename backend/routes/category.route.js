import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllCategories);

router.get("/:id", getCategoryById);

router.post("/", protectRoute, adminRoute, createCategory);

router.put("/:id", protectRoute, adminRoute, updateCategory);

router.delete("/:id", protectRoute, adminRoute, deleteCategory);

export default router;
