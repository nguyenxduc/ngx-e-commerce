import express from "express";
import { listCategories, getCategory, getSubCategoriesOfCategory, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", listCategories);
router.get("/:id", getCategory);
router.get("/:id/sub-categories", getSubCategoriesOfCategory);
router.post("/", protectRoute, adminRoute, upload.single('image'), createCategory);
router.patch("/:id", protectRoute, adminRoute, upload.single('image'), updateCategory);
router.delete("/:id", protectRoute, adminRoute, deleteCategory);

export default router;


