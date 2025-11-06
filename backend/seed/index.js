import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db.js";

async function clearDatabase() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUsers() {
  const password = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password_digest: password,
      role: "admin",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password_digest: password,
      role: "user",
      phone: "0123456789",
      address: "123 Sample Street, HCMC",
    },
  });

  return { admin, user };
}

async function seedCategoriesAndProducts() {
  const phoneCat = await prisma.category.create({
    data: {
      name: "Phones",
      image_url: "https://picsum.photos/seed/phones/600/400",
      description: "Smartphones and mobile devices",
    },
  });

  const laptopCat = await prisma.category.create({
    data: {
      name: "Laptops",
      image_url: "https://picsum.photos/seed/laptops/600/400",
      description: "Laptops and ultrabooks",
    },
  });

  const androidSub = await prisma.subCategory.create({
    data: {
      name: "Android",
      image_url: "https://picsum.photos/seed/android/600/400",
      description: "Android phones",
      category_id: phoneCat.id,
    },
  });

  const iosSub = await prisma.subCategory.create({
    data: {
      name: "iOS",
      image_url: "https://picsum.photos/seed/ios/600/400",
      description: "Apple iPhones",
      category_id: phoneCat.id,
    },
  });

  const ultrabookSub = await prisma.subCategory.create({
    data: {
      name: "Ultrabook",
      image_url: "https://picsum.photos/seed/ultrabook/600/400",
      description: "Thin and light laptops",
      category_id: laptopCat.id,
    },
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Galaxy S24",
        price: 999.99,
        discount: 50.0,
        quantity: 50,
        sold: 10,
        img: [
          "https://picsum.photos/seed/galaxy1/800/600",
          "https://picsum.photos/seed/galaxy2/800/600",
        ],
        specs: [{ ram: "8GB", storage: "128GB" }],
        specs_detail: [{ screen: '6.2"', battery: "4000mAh" }],
        color: [
          { name: "Black", code: "#000000" },
          { name: "Blue", code: "#1e90ff" },
        ],
        category_id: phoneCat.id,
        sub_category_id: androidSub.id,
      },
      {
        name: "iPhone 15",
        price: 1199.0,
        discount: 100.0,
        quantity: 40,
        sold: 5,
        img: [
          "https://picsum.photos/seed/iphone1/800/600",
          "https://picsum.photos/seed/iphone2/800/600",
        ],
        specs: [{ ram: "8GB", storage: "256GB" }],
        specs_detail: [{ screen: '6.1"', battery: "3500mAh" }],
        color: [{ name: "White", code: "#ffffff" }],
        category_id: phoneCat.id,
        sub_category_id: iosSub.id,
      },
      {
        name: "ZenBook 14",
        price: 1399.0,
        discount: 150.0,
        quantity: 25,
        sold: 2,
        img: [
          "https://picsum.photos/seed/zenbook1/800/600",
          "https://picsum.photos/seed/zenbook2/800/600",
        ],
        specs: [{ cpu: "Intel i7", ram: "16GB", storage: "512GB SSD" }],
        specs_detail: [{ screen: '14"', weight: "1.2kg" }],
        color: [{ name: "Gray", code: "#808080" }],
        category_id: laptopCat.id,
        sub_category_id: ultrabookSub.id,
      },
    ],
  });
}

async function seedCoupons() {
  await prisma.coupon.createMany({
    data: [
      {
        code: "WELCOME10",
        description: "10% off for new users",
        discount_type: "percent",
        discount_value: 10,
        min_order: 100,
        usage_limit: 100,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        code: "FLAT50",
        description: "Flat $50 off",
        discount_type: "fixed",
        discount_value: 50,
        min_order: 300,
        usage_limit: 50,
        expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    ],
  });
}

async function seedOrders(userId) {
  const products = await prisma.product.findMany({
    orderBy: { created_at: "asc" },
    take: 3,
  });
  if (products.length === 0) return;

  // Order 1 - one item
  const p1 = products[0];
  const p1Unit = Number(p1.price) - Number(p1.discount || 0);
  const order1 = await prisma.order.create({
    data: {
      user_id: userId,
      order_number: `ORD-${Math.floor(Math.random() * 1000000)}`,
      total_amount: p1Unit,
      status: "pending",
      payment_method: "cash_on_delivery",
      shipping_address: {
        street: "123 Sample Street",
        city: "HCMC",
        country: "VN",
      },
      order_items: {
        create: [
          {
            product_id: p1.id,
            quantity: 1,
            unit_price: p1Unit,
            total_price: p1Unit,
            color: (Array.isArray(p1.color) && p1.color[0]?.name) || null,
          },
        ],
      },
    },
  });

  // Order 2 - two items
  const p2 = products[1] || p1;
  const p3 = products[2] || p1;
  const p2Unit = Number(p2.price) - Number(p2.discount || 0);
  const p3Unit = Number(p3.price) - Number(p3.discount || 0);
  const total2 = p2Unit * 2 + p3Unit * 1;
  const order2 = await prisma.order.create({
    data: {
      user_id: userId,
      order_number: `ORD-${Math.floor(Math.random() * 1000000)}`,
      total_amount: total2,
      status: "confirmed",
      payment_method: "credit_card",
      shipping_address: {
        street: "456 Sample Ave",
        city: "Hanoi",
        country: "VN",
      },
      order_items: {
        create: [
          {
            product_id: p2.id,
            quantity: 2,
            unit_price: p2Unit,
            total_price: p2Unit * 2,
            color: (Array.isArray(p2.color) && p2.color[0]?.name) || null,
          },
          {
            product_id: p3.id,
            quantity: 1,
            unit_price: p3Unit,
            total_price: p3Unit,
            color: (Array.isArray(p3.color) && p3.color[0]?.name) || null,
          },
        ],
      },
    },
  });

  return { order1, order2 };
}

async function seedReviews(userId) {
  const products = await prisma.product.findMany({ take: 3 });
  if (products.length === 0) return;

  const reviewsData = [
    {
      user_id: userId,
      product_id: products[0].id,
      rating: 5,
      comment: "Excellent product! Highly recommended.",
    },
    {
      user_id: userId,
      product_id: (products[1] || products[0]).id,
      rating: 4,
      comment: "Very good value for money.",
    },
    {
      user_id: userId,
      product_id: (products[2] || products[0]).id,
      rating: 3,
      comment: "Decent, but could be better.",
    },
  ];

  await prisma.review.createMany({ data: reviewsData });
}

async function main() {
  console.log("Seeding database...");
  await clearDatabase();
  const { admin, user } = await seedUsers();
  await seedCategoriesAndProducts();
  await seedCoupons();
  await seedOrders(user.id);
  await seedReviews(user.id);
  console.log("Seed completed:", {
    admin: { id: admin.id?.toString?.(), email: admin.email },
    user: { id: user.id?.toString?.(), email: user.email },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
