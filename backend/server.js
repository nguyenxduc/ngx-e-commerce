import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { connectDB } from "./lib/db.js";
import { initializeSocket } from "./lib/socket.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import reviewRoutes from "./routes/review.route.js";
import orderRoutes from "./routes/order.route.js";
import productTypeRoutes from "./routes/productType.route.js";
import sellerRoutes from "./routes/seller.route.js";
import shopRoutes from "./routes/shop.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import followerRoutes from "./routes/follower.route.js";
import chatRoutes from "./routes/chat.route.js";

import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";
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
app.use("/api/product-types", productTypeRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/followers", followerRoutes);
app.use("/api/chat", chatRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize Socket.IO
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
