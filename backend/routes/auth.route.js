import express from "express";
import {
  login,
  logout,
  signup,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Spec aliases
router.post("/register", signup);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/me", protectRoute, getProfile);
router.patch("/update_profile", protectRoute, updateProfile);
router.post("/change_password", protectRoute, changePassword);

export default router;
