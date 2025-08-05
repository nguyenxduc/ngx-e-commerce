import express from "express";

import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { get } from "mongoose";

const router = express.Router();

router.get("/", protectRoute, adminRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res
      .status(500)
      .json({ message: "Error fetching analytics data", error: error.message });
  }

  const endDay = new Date();
  const startDay = new Date(endDay.getDate() - 7 * 24 * 60 * 60 * 1000);

  const dailySalesData = await getDailySalesData(startDay, endDay);

  res.json({
    analyticsData,
    dailySalesData,
  });
});

export default router;
