import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { prisma } from "./lib/db.js";
BigInt.prototype.toJSON = function () {
  return Number(this);
};
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import reviewRoutes from "./routes/review.route.js";
import orderRoutes from "./routes/order.route.js";
import customerRoutes from "./routes/customer.route.js";
// removed legacy product type routes
import categoryRoutes from "./routes/category.route.js";
import subCategoryRoutes from "./routes/subCategory.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import filterRoutes from "./routes/filter.route.js";

import cors from "cors";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/sub-categories", subCategoryRoutes);
app.use("/api/filter", filterRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
