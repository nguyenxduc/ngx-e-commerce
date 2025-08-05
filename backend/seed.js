import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Product from "./models/product.model.js";
import ProductType from "./models/productType.model.js";
import Review from "./models/review.model.js";
import Coupon from "./models/coupon.model.js";
import Order from "./models/order.model.js";

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected successfully");
} catch (error) {
  console.error("MongoDB connection failed:", error);
  process.exit(1);
}

const seed = async () => {
  // Xóa tất cả dữ liệu cũ
  await User.deleteMany();
  await Product.deleteMany();
  await ProductType.deleteMany();
  await Review.deleteMany();
  await Coupon.deleteMany();
  await Order.deleteMany();

  console.log("🗑️ Đã xóa dữ liệu cũ");

  // Tạo danh mục sản phẩm
  const categories = await ProductType.insertMany([
    { name: "Áo thun", description: "Áo thun nam nữ các loại" },
    { name: "Áo sơ mi", description: "Áo sơ mi công sở, dự tiệc" },
    { name: "Quần jean", description: "Quần jean nam nữ thời trang" },
    { name: "Quần tây", description: "Quần tây công sở, lịch sự" },
    { name: "Váy", description: "Váy đầm nữ thời trang" },
    { name: "Áo khoác", description: "Áo khoác, jacket thời trang" },
    { name: "Giày", description: "Giày dép nam nữ các loại" },
    { name: "Túi xách", description: "Túi xách, balo thời trang" },
  ]);

  console.log("📂 Đã tạo danh mục sản phẩm");

  // Tạo người dùng
  const admin = await User.create({
    name: "Admin",
    email: "admin@fashion.com",
    password: await bcrypt.hash("123456", 10),
    role: "admin",
  });

  const seller = await User.create({
    name: "Nguyễn Văn Bán",
    email: "seller@fashion.com",
    password: await bcrypt.hash("123456", 10),
    role: "seller",
  });

  const customer1 = await User.create({
    name: "Trần Thị Mua",
    email: "customer1@example.com",
    password: await bcrypt.hash("123456", 10),
    role: "customer",
  });

  const customer2 = await User.create({
    name: "Lê Văn Khách",
    email: "customer2@example.com",
    password: await bcrypt.hash("123456", 10),
    role: "customer",
  });

  console.log("👥 Đã tạo người dùng");

  // Tạo sản phẩm
  const products = await Product.create([
    {
      name: "Áo thun nam basic",
      description: "Áo thun nam chất liệu cotton 100%, thoáng mát, dễ giặt",
      price: 150000,
      category: categories[0]._id,
      brand: "Fashion Basic",
      countInStock: 50,
      image: "tshirts.jpg",
      ratings: 4.5,
      numReviews: 12,
      seller: seller._id,
    },
    {
      name: "Áo sơ mi nam trắng",
      description: "Áo sơ mi nam công sở, chất liệu cotton cao cấp",
      price: 350000,
      category: categories[1]._id,
      brand: "Office Style",
      countInStock: 30,
      image: "suits.jpg",
      ratings: 4.8,
      numReviews: 8,
      seller: seller._id,
    },
    {
      name: "Quần jean nam slim fit",
      description: "Quần jean nam ôm dáng, chất liệu denim cao cấp",
      price: 450000,
      category: categories[2]._id,
      brand: "Denim Pro",
      countInStock: 25,
      image: "jeans.jpg",
      ratings: 4.2,
      numReviews: 15,
      seller: seller._id,
    },
    {
      name: "Quần tây nam đen",
      description: "Quần tây nam công sở, chất liệu polyester thoáng mát",
      price: 280000,
      category: categories[3]._id,
      brand: "Business Wear",
      countInStock: 40,
      image: "suits.jpg",
      ratings: 4.6,
      numReviews: 10,
      seller: seller._id,
    },
    {
      name: "Váy đầm nữ hoa",
      description: "Váy đầm nữ thời trang, họa tiết hoa nhẹ nhàng",
      price: 380000,
      category: categories[4]._id,
      brand: "Lady Fashion",
      countInStock: 20,
      image: "tshirts.jpg",
      ratings: 4.7,
      numReviews: 6,
      seller: seller._id,
    },
    {
      name: "Áo khoác denim nam",
      description: "Áo khoác denim nam thời trang, phong cách streetwear",
      price: 650000,
      category: categories[5]._id,
      brand: "Street Style",
      countInStock: 15,
      image: "jackets.jpg",
      ratings: 4.9,
      numReviews: 18,
      seller: seller._id,
    },
    {
      name: "Giày sneaker nam",
      description: "Giày sneaker nam thể thao, đế cao su bền bỉ",
      price: 520000,
      category: categories[6]._id,
      brand: "Sport Shoes",
      countInStock: 35,
      image: "shoes.jpg",
      ratings: 4.4,
      numReviews: 22,
      seller: seller._id,
    },
    {
      name: "Túi xách nữ thời trang",
      description: "Túi xách nữ thời trang, chất liệu da tổng hợp cao cấp",
      price: 420000,
      category: categories[7]._id,
      brand: "Luxury Bag",
      countInStock: 12,
      image: "bags.jpg",
      ratings: 4.3,
      numReviews: 9,
      seller: seller._id,
    },
  ]);

  console.log("👕 Đã tạo sản phẩm");

  // Tạo đánh giá
  const reviews = await Review.create([
    {
      user: customer1._id,
      product: products[0]._id,
      rating: 5,
      comment: "Áo rất đẹp, chất liệu tốt, giao hàng nhanh!",
    },
    {
      user: customer2._id,
      product: products[0]._id,
      rating: 4,
      comment: "Áo vừa vặn, màu sắc đẹp như trong hình",
    },
    {
      user: customer1._id,
      product: products[1]._id,
      rating: 5,
      comment: "Áo sơ mi rất đẹp, phù hợp đi làm",
    },
    {
      user: customer2._id,
      product: products[2]._id,
      rating: 4,
      comment: "Quần jean đẹp, dáng ôm nhưng hơi chật",
    },
    {
      user: customer1._id,
      product: products[3]._id,
      rating: 5,
      comment: "Quần tây rất đẹp, chất liệu tốt",
    },
    {
      user: customer2._id,
      product: products[4]._id,
      rating: 4,
      comment: "Váy đẹp, phù hợp đi dự tiệc",
    },
    {
      user: customer1._id,
      product: products[5]._id,
      rating: 5,
      comment: "Áo khoác rất đẹp, phong cách thời trang",
    },
    {
      user: customer2._id,
      product: products[6]._id,
      rating: 4,
      comment: "Giày đẹp, đi thoải mái",
    },
    {
      user: customer1._id,
      product: products[7]._id,
      rating: 4,
      comment: "Túi xách đẹp, chất liệu tốt",
    },
  ]);

  console.log("⭐ Đã tạo đánh giá");

  // Tạo mã giảm giá
  const coupons = await Coupon.create([
    {
      code: "WELCOME10",
      discountPercentage: 10,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
      isActive: true,
      userId: customer1._id,
    },
    {
      code: "FASHION20",
      discountPercentage: 20,
      expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 ngày
      isActive: true,
      userId: customer2._id,
    },
  ]);

  console.log("🎫 Đã tạo mã giảm giá");

  // Tạo đơn hàng mẫu
  const orders = await Order.create([
    {
      user: customer1._id,
      orderItems: [
        {
          product: products[0]._id,
          quantity: 2,
        },
        {
          product: products[1]._id,
          quantity: 1,
        },
      ],
      shippingAddress: {
        address: "123 Đường ABC, Quận 1",
        city: "TP. Hồ Chí Minh",
        postalCode: "70000",
        country: "Việt Nam",
      },
      paymentMethod: "COD",
      totalPrice: 650000,
      isPaid: true,
      paidAt: new Date(),
      isDelivered: false,
    },
    {
      user: customer2._id,
      orderItems: [
        {
          product: products[2]._id,
          quantity: 1,
        },
        {
          product: products[6]._id,
          quantity: 1,
        },
      ],
      shippingAddress: {
        address: "456 Đường XYZ, Quận 3",
        city: "TP. Hồ Chí Minh",
        postalCode: "70000",
        country: "Việt Nam",
      },
      paymentMethod: "Bank Transfer",
      totalPrice: 970000,
      isPaid: true,
      paidAt: new Date(),
      isDelivered: true,
      deliveredAt: new Date(),
    },
  ]);

  console.log("📦 Đã tạo đơn hàng mẫu");

  console.log("✅ Seed thành công! Dữ liệu đã được tạo:");
  console.log(`- ${categories.length} danh mục sản phẩm`);
  console.log(`- ${products.length} sản phẩm`);
  console.log(`- ${reviews.length} đánh giá`);
  console.log(`- ${coupons.length} mã giảm giá`);
  console.log(`- ${orders.length} đơn hàng mẫu`);
  console.log("\n🔑 Thông tin đăng nhập:");
  console.log("Admin: admin@fashion.com / 123456");
  console.log("Seller: seller@fashion.com / 123456");
  console.log("Customer 1: customer1@example.com / 123456");
  console.log("Customer 2: customer2@example.com / 123456");

  process.exit();
};

seed().catch((error) => {
  console.error("❌ Lỗi khi seed:", error);
  process.exit(1);
});
