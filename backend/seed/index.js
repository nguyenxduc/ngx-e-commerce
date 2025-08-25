import mongoose from "mongoose";
import dotenv from "dotenv";
import { seedUsers } from "./userSeeder.js";
import { seedProductTypes } from "./productTypeSeeder.js";
import { seedShops } from "./shopSeeder.js";
import { seedProducts } from "./productSeeder.js";
import { seedCoupons } from "./couponSeeder.js";
import { seedReviews } from "./reviewSeeder.js";
import { seedOrders } from "./orderSeeder.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
    }
    console.log("🗑️ Database cleared");
  } catch (error) {
    console.log("ℹ️ No collections to drop or error:", error.message);
  }
};

const runSeeds = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await clearDatabase();

    // Run seeders in order (respecting dependencies)
    console.log("\n👥 Seeding users...");
    const users = await seedUsers();

    console.log("\n🏷️ Seeding product types...");
    const productTypes = await seedProductTypes();

    console.log("\n🏪 Seeding shops...");
    const shops = await seedShops(users);

    console.log("\n📦 Seeding products...");
    const products = await seedProducts(users, productTypes, shops);

    console.log("\n🎫 Seeding coupons...");
    await seedCoupons();

    console.log("\n⭐ Seeding reviews...");
    await seedReviews(users, products);

    console.log("\n📋 Seeding orders...");
    await seedOrders(users, products);

    console.log("\n✅ Database seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Product Types: ${productTypes.length}`);
    console.log(`   - Shops: ${shops.length}`);
    console.log(`   - Products: ${products.length}`);
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);
  }
};

// Run if this file is executed directly

connectDB().then(runSeeds);

export { runSeeds };
