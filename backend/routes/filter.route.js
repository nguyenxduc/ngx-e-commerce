import express from "express";
import {
  getFilterMetadata,
  syncFilterOptionsFromProducts,
  listFilterOptions,
  getFilterOption,
  createFilterOption,
  updateFilterOption,
  deleteFilterOption,
} from "../controllers/filter.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route
router.get("/", getFilterMetadata);

// Admin routes
router.get("/admin", protectRoute, adminRoute, listFilterOptions);
router.get("/admin/:id", protectRoute, adminRoute, getFilterOption);
router.post("/admin", protectRoute, adminRoute, createFilterOption);
router.put("/admin/:id", protectRoute, adminRoute, updateFilterOption);
router.delete("/admin/:id", protectRoute, adminRoute, deleteFilterOption);
router.post("/sync", protectRoute, adminRoute, syncFilterOptionsFromProducts);

export default router;

