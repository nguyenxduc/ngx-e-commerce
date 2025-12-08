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
  await prisma.filterOption.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUsers() {
  const password = await bcrypt.hash("password123", 10);
  
  const users = [
    {
      name: "Admin User",
      email: "admin@example.com",
      password_digest: password,
      role: "admin",
    },
    {
      name: "John Doe",
      email: "john@example.com",
      password_digest: password,
      role: "user",
      phone: "0123456789",
      address: "123 Sample Street, HCMC",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      password_digest: password,
      role: "user",
      phone: "0987654321",
      address: "456 Main Avenue, Hanoi",
    },
    {
      name: "Bob Johnson",
      email: "bob@example.com",
      password_digest: password,
      role: "user",
      phone: "0111222333",
      address: "789 Park Road, Da Nang",
    },
    {
      name: "Alice Williams",
      email: "alice@example.com",
      password_digest: password,
      role: "user",
      phone: "0444555666",
      address: "321 Ocean Drive, Nha Trang",
    },
    {
      name: "Charlie Brown",
      email: "charlie@example.com",
      password_digest: password,
      role: "user",
      phone: "0777888999",
      address: "654 Mountain View, Da Lat",
    },
    {
      name: "Diana Prince",
      email: "diana@example.com",
      password_digest: password,
      role: "user",
      phone: "0333444555",
      address: "987 Forest Lane, Can Tho",
    },
    {
      name: "Edward Norton",
      email: "edward@example.com",
      password_digest: password,
      role: "user",
      phone: "0666777888",
      address: "147 River Street, Hue",
    },
  ];

  const createdUsers = await Promise.all(
    users.map((user) => prisma.user.create({ data: user }))
  );

  return { admin: createdUsers[0], users: createdUsers };
}

async function seedCategories() {
  const categories = [
    {
      name: "Smartphones",
      image_url: "https://picsum.photos/seed/phones/600/400",
      description: "Latest smartphones and mobile devices",
    },
    {
      name: "Laptops",
      image_url: "https://picsum.photos/seed/laptops/600/400",
      description: "Laptops and ultrabooks for work and gaming",
    },
    {
      name: "Tablets",
      image_url: "https://picsum.photos/seed/tablets/600/400",
      description: "Tablets and iPads for productivity",
    },
    {
      name: "Headphones",
      image_url: "https://picsum.photos/seed/headphones/600/400",
      description: "Wireless and wired headphones",
    },
    {
      name: "Smartwatches",
      image_url: "https://picsum.photos/seed/watches/600/400",
      description: "Smartwatches and fitness trackers",
    },
    {
      name: "Cameras",
      image_url: "https://picsum.photos/seed/cameras/600/400",
      description: "Digital cameras and accessories",
    },
    {
      name: "Gaming",
      image_url: "https://picsum.photos/seed/gaming/600/400",
      description: "Gaming consoles and accessories",
    },
    {
      name: "Accessories",
      image_url: "https://picsum.photos/seed/accessories/600/400",
      description: "Phone cases, chargers, and more",
    },
  ];

  const createdCategories = await Promise.all(
    categories.map((cat) => prisma.category.create({ data: cat }))
  );

  return createdCategories;
}

async function seedSubCategories(categories) {
  const subCategories = [
    {
      name: "Android",
      image_url: "https://picsum.photos/seed/android/600/400",
      description: "Android smartphones",
      category_id: categories[0].id,
    },
    {
      name: "iOS",
      image_url: "https://picsum.photos/seed/ios/600/400",
      description: "Apple iPhones",
      category_id: categories[0].id,
    },
    {
      name: "Ultrabook",
      image_url: "https://picsum.photos/seed/ultrabook/600/400",
      description: "Thin and light laptops",
      category_id: categories[1].id,
    },
    {
      name: "Gaming Laptop",
      image_url: "https://picsum.photos/seed/gaming-laptop/600/400",
      description: "High-performance gaming laptops",
      category_id: categories[1].id,
    },
    {
      name: "iPad",
      image_url: "https://picsum.photos/seed/ipad/600/400",
      description: "Apple iPads",
      category_id: categories[2].id,
    },
    {
      name: "Android Tablet",
      image_url: "https://picsum.photos/seed/android-tablet/600/400",
      description: "Android tablets",
      category_id: categories[2].id,
    },
    {
      name: "Wireless",
      image_url: "https://picsum.photos/seed/wireless/600/400",
      description: "Wireless headphones",
      category_id: categories[3].id,
    },
    {
      name: "Wired",
      image_url: "https://picsum.photos/seed/wired/600/400",
      description: "Wired headphones",
      category_id: categories[3].id,
    },
  ];

  const createdSubCategories = await Promise.all(
    subCategories.map((sub) => prisma.subCategory.create({ data: sub }))
  );

  return createdSubCategories;
}

async function seedProducts(categories, subCategories) {
  const products = [
    {
      name: "Galaxy S24 Ultra",
      price: 1199.99,
      discount: 100.0,
      quantity: 50,
      sold: 15,
      rating: 4.8,
      img: [
        "https://picsum.photos/seed/galaxy1/800/600",
        "https://picsum.photos/seed/galaxy2/800/600",
        "https://picsum.photos/seed/galaxy3/800/600",
      ],
      specs: [
        { label: "Brand", value: "Samsung" },
        { label: "RAM", value: "12GB" },
        { label: "Processor", value: "Snapdragon 8 Gen 3" },
        { label: "Storage", value: "256GB" },
      ],
      specs_detail: [
        { label: "Screen Size", value: "6.8 inch" },
        { label: "Battery", value: "5000mAh" },
        { label: "Camera", value: "200MP" },
      ],
      color: [
        { name: "Black", code: "#000000", quantity: 20 },
        { name: "Blue", code: "#1e90ff", quantity: 15 },
        { name: "Silver", code: "#c0c0c0", quantity: 15 },
      ],
      category_id: categories[0].id,
      sub_category_id: subCategories[0].id,
    },
    {
      name: "iPhone 15 Pro Max",
      price: 1299.99,
      discount: 150.0,
      quantity: 40,
      sold: 12,
      rating: 4.9,
      img: [
        "https://picsum.photos/seed/iphone1/800/600",
        "https://picsum.photos/seed/iphone2/800/600",
      ],
      specs: [
        { label: "Brand", value: "Apple" },
        { label: "RAM", value: "8GB" },
        { label: "Processor", value: "A17 Pro" },
        { label: "Storage", value: "256GB" },
      ],
      specs_detail: [
        { label: "Screen Size", value: "6.7 inch" },
        { label: "Battery", value: "4441mAh" },
        { label: "Camera", value: "48MP" },
      ],
      color: [
        { name: "Titanium", code: "#878681", quantity: 20 },
        { name: "Blue", code: "#4169e1", quantity: 20 },
      ],
      category_id: categories[0].id,
      sub_category_id: subCategories[1].id,
    },
    {
      name: "MacBook Pro 16",
      price: 2499.99,
      discount: 200.0,
      quantity: 25,
      sold: 8,
      rating: 4.7,
      img: [
        "https://picsum.photos/seed/macbook1/800/600",
        "https://picsum.photos/seed/macbook2/800/600",
      ],
      specs: [
        { label: "Brand", value: "Apple" },
        { label: "RAM", value: "32GB" },
        { label: "Processor", value: "M3 Max" },
        { label: "Storage", value: "1TB SSD" },
        { label: "GPU Brand", value: "Apple" },
      ],
      specs_detail: [
        { label: "Screen Size", value: "16.2 inch" },
        { label: "Weight", value: "2.15kg" },
      ],
      color: [{ name: "Space Gray", code: "#4d4d4d", quantity: 25 }],
      category_id: categories[1].id,
      sub_category_id: subCategories[2].id,
    },
    {
      name: "ASUS ROG Strix G16",
      price: 1899.99,
      discount: 150.0,
      quantity: 30,
      sold: 5,
      rating: 4.6,
      img: [
        "https://picsum.photos/seed/rog1/800/600",
        "https://picsum.photos/seed/rog2/800/600",
      ],
      specs: [
        { label: "Brand", value: "ASUS" },
        { label: "RAM", value: "16GB" },
        { label: "Processor", value: "Intel i7-13700H" },
        { label: "Storage", value: "512GB SSD" },
        { label: "GPU Brand", value: "NVIDIA" },
      ],
      specs_detail: [
        { label: "Screen Size", value: "16 inch" },
        { label: "GPU", value: "RTX 4060" },
      ],
      color: [{ name: "Black", code: "#000000", quantity: 30 }],
      category_id: categories[1].id,
      sub_category_id: subCategories[3].id,
    },
    {
      name: "iPad Pro 12.9",
      price: 1099.99,
      discount: 100.0,
      quantity: 35,
      sold: 10,
      rating: 4.8,
      img: [
        "https://picsum.photos/seed/ipad1/800/600",
        "https://picsum.photos/seed/ipad2/800/600",
      ],
      specs: [
        { label: "Brand", value: "Apple" },
        { label: "RAM", value: "8GB" },
        { label: "Processor", value: "M2" },
        { label: "Storage", value: "256GB" },
      ],
      specs_detail: [
        { label: "Screen Size", value: "12.9 inch" },
        { label: "Battery", value: "40.88 Wh" },
      ],
      color: [
        { name: "Silver", code: "#c0c0c0", quantity: 20 },
        { name: "Space Gray", code: "#4d4d4d", quantity: 15 },
      ],
      category_id: categories[2].id,
      sub_category_id: subCategories[4].id,
    },
    {
      name: "Samsung Galaxy Tab S9",
      price: 799.99,
      discount: 50.0,
      quantity: 28,
      sold: 7,
      rating: 4.5,
      img: [
        "https://picsum.photos/seed/tab1/800/600",
        "https://picsum.photos/seed/tab2/800/600",
      ],
      specs: [
        { label: "Brand", value: "Samsung" },
        { label: "RAM", value: "8GB" },
        { label: "Processor", value: "Snapdragon 8 Gen 2" },
        { label: "Storage", value: "128GB" },
      ],
      specs_detail: [
        { label: "Screen Size", value: "11 inch" },
        { label: "Battery", value: "8400mAh" },
      ],
      color: [
        { name: "Black", code: "#000000", quantity: 15 },
        { name: "Beige", code: "#f5f5dc", quantity: 13 },
      ],
      category_id: categories[2].id,
      sub_category_id: subCategories[5].id,
    },
    {
      name: "Sony WH-1000XM5",
      price: 399.99,
      discount: 50.0,
      quantity: 45,
      sold: 20,
      rating: 4.9,
      img: [
        "https://picsum.photos/seed/sony1/800/600",
        "https://picsum.photos/seed/sony2/800/600",
      ],
      specs: [
        { label: "Brand", value: "Sony" },
        { label: "Type", value: "Wireless" },
      ],
      specs_detail: [
        { label: "Battery", value: "30 hours" },
        { label: "Noise Canceling", value: "Yes" },
      ],
      color: [
        { name: "Black", code: "#000000", quantity: 25 },
        { name: "Silver", code: "#c0c0c0", quantity: 20 },
      ],
      category_id: categories[3].id,
      sub_category_id: subCategories[6].id,
    },
    {
      name: "AirPods Pro 2",
      price: 249.99,
      discount: 25.0,
      quantity: 60,
      sold: 30,
      rating: 4.8,
      img: [
        "https://picsum.photos/seed/airpods1/800/600",
        "https://picsum.photos/seed/airpods2/800/600",
      ],
      specs: [
        { label: "Brand", value: "Apple" },
        { label: "Type", value: "Wireless" },
      ],
      specs_detail: [
        { label: "Battery", value: "6 hours" },
        { label: "Noise Canceling", value: "Yes" },
      ],
      color: [{ name: "White", code: "#ffffff", quantity: 60 }],
      category_id: categories[3].id,
      sub_category_id: subCategories[6].id,
    },
    {
      name: "Apple Watch Series 9",
      price: 399.99,
      discount: 40.0,
      quantity: 40,
      sold: 15,
      rating: 4.7,
      img: [
        "https://picsum.photos/seed/watch1/800/600",
        "https://picsum.photos/seed/watch2/800/600",
      ],
      specs: [
        { label: "Brand", value: "Apple" },
        { label: "Size", value: "45mm" },
      ],
      specs_detail: [
        { label: "Battery", value: "18 hours" },
        { label: "Water Resistance", value: "50m" },
      ],
      color: [
        { name: "Midnight", code: "#191970", quantity: 15 },
        { name: "Starlight", code: "#f5f5dc", quantity: 15 },
        { name: "Product Red", code: "#ff0000", quantity: 10 },
      ],
      category_id: categories[4].id,
      sub_category_id: null,
    },
    {
      name: "Canon EOS R5",
      price: 3899.99,
      discount: 300.0,
      quantity: 15,
      sold: 3,
      rating: 4.9,
      img: [
        "https://picsum.photos/seed/canon1/800/600",
        "https://picsum.photos/seed/canon2/800/600",
      ],
      specs: [
        { label: "Brand", value: "Canon" },
        { label: "Sensor", value: "45MP" },
      ],
      specs_detail: [
        { label: "Video", value: "8K" },
        { label: "ISO", value: "100-51200" },
      ],
      color: [{ name: "Black", code: "#000000", quantity: 15 }],
      category_id: categories[5].id,
      sub_category_id: null,
    },
    {
      name: "PlayStation 5",
      price: 499.99,
      discount: 0.0,
      quantity: 20,
      sold: 50,
      rating: 4.8,
      img: [
        "https://picsum.photos/seed/ps5-1/800/600",
        "https://picsum.photos/seed/ps5-2/800/600",
      ],
      specs: [
        { label: "Brand", value: "Sony" },
        { label: "Storage", value: "825GB SSD" },
      ],
      specs_detail: [
        { label: "GPU", value: "AMD RDNA 2" },
        { label: "RAM", value: "16GB GDDR6" },
      ],
      color: [{ name: "White", code: "#ffffff", quantity: 20 }],
      category_id: categories[6].id,
      sub_category_id: null,
    },
    {
      name: "Xbox Series X",
      price: 499.99,
      discount: 0.0,
      quantity: 18,
      sold: 45,
      rating: 4.7,
      img: [
        "https://picsum.photos/seed/xbox1/800/600",
        "https://picsum.photos/seed/xbox2/800/600",
      ],
      specs: [
        { label: "Brand", value: "Microsoft" },
        { label: "Storage", value: "1TB SSD" },
      ],
      specs_detail: [
        { label: "GPU", value: "AMD RDNA 2" },
        { label: "RAM", value: "16GB GDDR6" },
      ],
      color: [{ name: "Black", code: "#000000", quantity: 18 }],
      category_id: categories[6].id,
      sub_category_id: null,
    },
  ];

  const createdProducts = await Promise.all(
    products.map((product) => prisma.product.create({ data: product }))
  );

  return createdProducts;
}

async function seedFilterOptions(categories) {
  const filterOptions = [
    // Brand filters (global)
    { key: "brand", label: "Brand", value: "Apple", category_id: null, order: 1 },
    { key: "brand", label: "Brand", value: "Samsung", category_id: null, order: 2 },
    { key: "brand", label: "Brand", value: "ASUS", category_id: null, order: 3 },
    { key: "brand", label: "Brand", value: "Sony", category_id: null, order: 4 },
    { key: "brand", label: "Brand", value: "Canon", category_id: null, order: 5 },
    { key: "brand", label: "Brand", value: "Microsoft", category_id: null, order: 6 },
    { key: "brand", label: "Brand", value: "Dell", category_id: null, order: 7 },
    
    // RAM filters (global)
    { key: "ram", label: "RAM", value: "8GB", category_id: null, order: 1 },
    { key: "ram", label: "RAM", value: "12GB", category_id: null, order: 2 },
    { key: "ram", label: "RAM", value: "16GB", category_id: null, order: 3 },
    { key: "ram", label: "RAM", value: "32GB", category_id: null, order: 4 },
    
    // Processor filters (global)
    { key: "processor", label: "Processor", value: "A17 Pro", category_id: null, order: 1 },
    { key: "processor", label: "Processor", value: "M3 Max", category_id: null, order: 2 },
    { key: "processor", label: "Processor", value: "M2", category_id: null, order: 3 },
    { key: "processor", label: "Processor", value: "Snapdragon 8 Gen 3", category_id: null, order: 4 },
    { key: "processor", label: "Processor", value: "Snapdragon 8 Gen 2", category_id: null, order: 5 },
    { key: "processor", label: "Processor", value: "Intel i7-13700H", category_id: null, order: 6 },
    
    // Screen Size filters (global)
    { key: "screen_size", label: "Screen Size", value: "6.7 inch", category_id: null, order: 1 },
    { key: "screen_size", label: "Screen Size", value: "6.8 inch", category_id: null, order: 2 },
    { key: "screen_size", label: "Screen Size", value: "11 inch", category_id: null, order: 3 },
    { key: "screen_size", label: "Screen Size", value: "12.9 inch", category_id: null, order: 4 },
    { key: "screen_size", label: "Screen Size", value: "14 inch", category_id: null, order: 5 },
    { key: "screen_size", label: "Screen Size", value: "16 inch", category_id: null, order: 6 },
    { key: "screen_size", label: "Screen Size", value: "16.2 inch", category_id: null, order: 7 },
    
    // GPU Brand filters (global)
    { key: "gpu_brand", label: "GPU Brand", value: "Apple", category_id: null, order: 1 },
    { key: "gpu_brand", label: "GPU Brand", value: "NVIDIA", category_id: null, order: 2 },
    { key: "gpu_brand", label: "GPU Brand", value: "AMD", category_id: null, order: 3 },
    
    // Drive Size filters (global)
    { key: "drive_size", label: "Drive Size", value: "128GB", category_id: null, order: 1 },
    { key: "drive_size", label: "Drive Size", value: "256GB", category_id: null, order: 2 },
    { key: "drive_size", label: "Drive Size", value: "512GB SSD", category_id: null, order: 3 },
    { key: "drive_size", label: "Drive Size", value: "1TB SSD", category_id: null, order: 4 },
    { key: "drive_size", label: "Drive Size", value: "825GB SSD", category_id: null, order: 5 },
  ];

  await prisma.filterOption.createMany({ data: filterOptions });
}

async function seedCoupons() {
  const coupons = [
    {
      code: "WELCOME10",
      description: "10% off for new users",
      discount_type: "percent",
      discount_value: 10,
      min_order: 100,
      usage_limit: 100,
      used_count: 5,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      code: "FLAT50",
      description: "Flat $50 off",
      discount_type: "fixed",
      discount_value: 50,
      min_order: 300,
      usage_limit: 50,
      used_count: 10,
      expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    {
      code: "SUMMER20",
      description: "20% off summer sale",
      discount_type: "percent",
      discount_value: 20,
      min_order: 200,
      usage_limit: 200,
      used_count: 25,
      expires_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
    {
      code: "NEW100",
      description: "$100 off orders over $1000",
      discount_type: "fixed",
      discount_value: 100,
      min_order: 1000,
      usage_limit: 30,
      used_count: 3,
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
    {
      code: "STUDENT15",
      description: "15% student discount",
      discount_type: "percent",
      discount_value: 15,
      min_order: 150,
      usage_limit: 500,
      used_count: 50,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
    {
      code: "VIP25",
      description: "25% off for VIP members",
      discount_type: "percent",
      discount_value: 25,
      min_order: 500,
      usage_limit: 100,
      used_count: 15,
      expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    },
    {
      code: "FLASH30",
      description: "30% flash sale",
      discount_type: "percent",
      discount_value: 30,
      min_order: 400,
      usage_limit: 50,
      used_count: 20,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      code: "FREESHIP",
      description: "Free shipping on orders over $50",
      discount_type: "fixed",
      discount_value: 10,
      min_order: 50,
      usage_limit: 1000,
      used_count: 200,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  ];

  await prisma.coupon.createMany({ data: coupons });
}

async function seedOrders(users, products) {
  const orders = [];
  
  for (let i = 0; i < 7; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const unitPrice = Number(product.price) - Number(product.discount || 0);
    const totalPrice = unitPrice * quantity;

    const order = await prisma.order.create({
      data: {
        user_id: user.id,
        order_number: `ORD-${Date.now()}-${i}`,
        total_amount: totalPrice,
        status: ["pending", "confirmed", "processing", "shipped", "delivered"][i % 5],
        payment_method: ["credit_card", "debit_card", "cash_on_delivery", "paypal"][i % 4],
        shipping_address: {
          street: `${Math.floor(Math.random() * 999) + 1} Sample Street`,
          city: ["HCMC", "Hanoi", "Da Nang", "Nha Trang"][i % 4],
          country: "VN",
        },
        order_items: {
          create: [
            {
              product_id: product.id,
              quantity: quantity,
              unit_price: unitPrice,
              total_price: totalPrice,
              color: Array.isArray(product.color) && product.color[0]?.name || null,
            },
          ],
        },
      },
    });
    
    orders.push(order);
  }

  return orders;
}

async function seedReviews(users, products) {
  const reviews = [];
  const comments = [
    "Excellent product! Highly recommended.",
    "Very good value for money.",
    "Decent, but could be better.",
    "Amazing quality and fast shipping!",
    "Great product, exceeded my expectations.",
    "Good product but delivery was slow.",
    "Perfect for my needs, very satisfied!",
    "Not bad, but there are better options.",
    "Outstanding quality and performance!",
    "Good value, would buy again.",
  ];

  for (let i = 0; i < 7; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5

    const review = await prisma.review.create({
      data: {
        user_id: user.id,
        product_id: product.id,
        rating: rating,
        comment: comments[i % comments.length],
      },
    });
    
    reviews.push(review);
  }

  return reviews;
}

async function seedCarts(users, products) {
  const carts = [];
  
  for (let i = 0; i < 7; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const product = products[Math.floor(Math.random() * products.length)];

    const cart = await prisma.cart.create({
      data: {
        user_id: user.id,
        cart_items: {
          create: [
            {
              product_id: product.id,
              quantity: Math.floor(Math.random() * 3) + 1,
              color: Array.isArray(product.color) && product.color[0] || {},
            },
          ],
        },
      },
    });
    
    carts.push(cart);
  }

  return carts;
}

async function seedWishlists(users, products) {
  const wishlists = [];
  
  for (let i = 0; i < 7; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const product = products[Math.floor(Math.random() * products.length)];

    try {
      const wishlist = await prisma.wishlist.create({
        data: {
          user_id: user.id,
          product_id: product.id,
        },
      });
      wishlists.push(wishlist);
    } catch (error) {
      // Skip if already exists (unique constraint)
    }
  }

  return wishlists;
}

async function seedSettings() {
  const defaultSettings = [
    {
      key: "bank_id",
      value: process.env.BANK_ID || "tpbank",
      description: "Mã ngân hàng cho QR code chuyển khoản",
      category: "bank",
      data_type: "string",
      is_public: false,
    },
    {
      key: "bank_account_no",
      value: process.env.BANK_ACCOUNT_NO || "",
      description: "Số tài khoản ngân hàng",
      category: "bank",
      data_type: "string",
      is_public: false,
    },
    {
      key: "bank_account_name",
      value: process.env.BANK_ACCOUNT_NAME || "Tech Shop",
      description: "Tên chủ tài khoản ngân hàng",
      category: "bank",
      data_type: "string",
      is_public: false,
    },
    {
      key: "qr_template",
      value: process.env.QR_TEMPLATE || "compact2",
      description: "Template QR code (compact2, compact, qr_only, print)",
      category: "bank",
      data_type: "string",
      is_public: false,
    },
    {
      key: "shipping_fee",
      value: process.env.SHIPPING_FEE || "22000",
      description: "Phí vận chuyển mặc định (VND)",
      category: "shipping",
      data_type: "number",
      is_public: true,
    },
    {
      key: "free_shipping_threshold",
      value: process.env.FREE_SHIPPING_THRESHOLD || "500000",
      description: "Ngưỡng miễn phí vận chuyển (VND)",
      category: "shipping",
      data_type: "number",
      is_public: true,
    },
    {
      key: "store_name",
      value: process.env.STORE_NAME || "Tech Shop",
      description: "Tên cửa hàng",
      category: "general",
      data_type: "string",
      is_public: true,
    },
    {
      key: "store_email",
      value: process.env.STORE_EMAIL || "contact@techshop.com",
      description: "Email liên hệ cửa hàng",
      category: "general",
      data_type: "string",
      is_public: true,
    },
    {
      key: "store_phone",
      value: process.env.STORE_PHONE || "0123456789",
      description: "Số điện thoại liên hệ cửa hàng",
      category: "general",
      data_type: "string",
      is_public: true,
    },
    {
      key: "store_address",
      value: process.env.STORE_ADDRESS || "123 Main Street, Ho Chi Minh City",
      description: "Địa chỉ cửa hàng",
      category: "general",
      data_type: "string",
      is_public: true,
    },
  ];

  const createdSettings = [];
  for (const setting of defaultSettings) {
    try {
      const result = await prisma.setting.upsert({
        where: { key: setting.key },
        update: {
          value: setting.value,
          description: setting.description,
          category: setting.category,
          data_type: setting.data_type,
          is_public: setting.is_public,
          updated_at: new Date(),
        },
        create: setting,
      });
      createdSettings.push(result);
    } catch (error) {
      console.error(`Error seeding setting ${setting.key}:`, error);
    }
  }

  return createdSettings;
}

async function main() {
  console.log("Seeding database...");
  await clearDatabase();
  
  const { admin, users } = await seedUsers();
  console.log(`✓ Created ${users.length} users`);
  
  const categories = await seedCategories();
  console.log(`✓ Created ${categories.length} categories`);
  
  const subCategories = await seedSubCategories(categories);
  console.log(`✓ Created ${subCategories.length} subcategories`);
  
  const products = await seedProducts(categories, subCategories);
  console.log(`✓ Created ${products.length} products`);
  
  await seedFilterOptions(categories);
  console.log(`✓ Created filter options`);
  
  await seedCoupons();
  console.log(`✓ Created 8 coupons`);
  
  const orders = await seedOrders(users, products);
  console.log(`✓ Created ${orders.length} orders`);
  
  const reviews = await seedReviews(users, products);
  console.log(`✓ Created ${reviews.length} reviews`);
  
  const carts = await seedCarts(users, products);
  console.log(`✓ Created ${carts.length} carts`);
  
  const wishlists = await seedWishlists(users, products);
  console.log(`✓ Created ${wishlists.length} wishlists`);
  
  await seedSettings();
  console.log(`✓ Created default settings`);
  
  console.log("\n✅ Seed completed successfully!");
  console.log({
    admin: { id: admin.id?.toString?.(), email: admin.email },
    totalUsers: users.length,
    totalCategories: categories.length,
    totalProducts: products.length,
    totalOrders: orders.length,
    totalReviews: reviews.length,
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
