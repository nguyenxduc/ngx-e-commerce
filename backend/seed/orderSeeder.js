import Order from "../models/order.model.js";

export const seedOrders = async (users, products) => {
  const customers = users.filter((user) => user.role === "customer");

  const ordersData = [
    // Order 1 - Alice's order
    {
      user: customers[0]._id, // Alice
      items: [
        {
          product: products[0]._id, // iPhone 15 Pro
          name: "iPhone 15 Pro",
          quantity: 1,
          price: 999.99,
          total: 999.99,
          shopId: products[0].shop,
        },
        {
          product: products[3]._id, // Denim Jacket
          name: "Classic Denim Jacket",
          quantity: 1,
          price: 89.99,
          total: 89.99,
          shopId: products[3].shop,
        },
      ],
      shippingAddress: {
        address: "123 Main Street",
        city: "New York",
        postalCode: "10001",
        country: "USA",
      },
      paymentMethod: "Credit Card",
      isPaid: true,
      status: "delivered",
      totalAmount: 1089.98,
      discountAmount: 108.99, // 10% discount
      couponCode: "WELCOME10",
    },

    // Order 2 - Bob's order
    {
      user: customers[1]._id, // Bob
      items: [
        {
          product: products[2]._id, // Sony Headphones
          name: "Sony WH-1000XM5",
          quantity: 1,
          price: 399.99,
          total: 399.99,
          shopId: products[2].shop,
        },
        {
          product: products[4]._id, // Leather Bag
          name: "Leather Crossbody Bag",
          quantity: 1,
          price: 129.99,
          total: 129.99,
          shopId: products[4].shop,
        },
      ],
      shippingAddress: {
        address: "456 Oak Avenue",
        city: "Los Angeles",
        postalCode: "90210",
        country: "USA",
      },
      paymentMethod: "PayPal",
      isPaid: true,
      status: "shipped",
      totalAmount: 529.98,
      discountAmount: 0,
      couponCode: "",
    },

    // Order 3 - Carol's order
    {
      user: customers[2]._id, // Carol
      items: [
        {
          product: products[5]._id, // Running Shoes
          name: "Running Shoes",
          quantity: 1,
          price: 149.99,
          total: 149.99,
          shopId: products[5].shop,
        },
        {
          product: products[7]._id, // Yoga Mat
          name: "Yoga Mat",
          quantity: 1,
          price: 39.99,
          total: 39.99,
          shopId: products[7].shop,
        },
      ],
      shippingAddress: {
        address: "789 Pine Street",
        city: "Chicago",
        postalCode: "60601",
        country: "USA",
      },
      paymentMethod: "Credit Card",
      isPaid: true,
      status: "processing",
      totalAmount: 189.98,
      discountAmount: 37.99, // 20% discount
      couponCode: "SAVE20",
    },

    // Order 4 - David's order
    {
      user: customers[3]._id, // David
      items: [
        {
          product: products[1]._id, // MacBook Air M2
          name: "MacBook Air M2",
          quantity: 1,
          price: 1199.99,
          total: 1199.99,
          shopId: products[1].shop,
        },
        {
          product: products[10]._id, // Gaming Mouse
          name: "Gaming Mouse",
          quantity: 1,
          price: 79.99,
          total: 79.99,
          shopId: products[10].shop,
        },
      ],
      shippingAddress: {
        address: "321 Elm Street",
        city: "Miami",
        postalCode: "33101",
        country: "USA",
      },
      paymentMethod: "Credit Card",
      isPaid: false,
      status: "pending",
      totalAmount: 1279.98,
      discountAmount: 0,
      couponCode: "",
    },

    // Order 5 - Alice's second order
    {
      user: customers[0]._id, // Alice
      items: [
        {
          product: products[11]._id, // Summer Dress
          name: "Summer Dress",
          quantity: 1,
          price: 69.99,
          total: 69.99,
          shopId: products[11].shop,
        },
        {
          product: products[12]._id, // Sunglasses
          name: "Sunglasses",
          quantity: 1,
          price: 89.99,
          total: 89.99,
          shopId: products[12].shop,
        },
      ],
      shippingAddress: {
        address: "123 Main Street",
        city: "New York",
        postalCode: "10001",
        country: "USA",
      },
      paymentMethod: "Credit Card",
      isPaid: true,
      status: "delivered",
      totalAmount: 159.98,
      discountAmount: 39.99, // 25% discount
      couponCode: "FLASH25",
    },

    // Order 6 - Bob's second order
    {
      user: customers[1]._id, // Bob
      items: [
        {
          product: products[6]._id, // Basketball
          name: "Basketball",
          quantity: 1,
          price: 49.99,
          total: 49.99,
          shopId: products[6].shop,
        },
        {
          product: products[8]._id, // Tennis Racket
          name: "Tennis Racket",
          quantity: 1,
          price: 199.99,
          total: 199.99,
          shopId: products[8].shop,
        },
      ],
      shippingAddress: {
        address: "456 Oak Avenue",
        city: "Los Angeles",
        postalCode: "90210",
        country: "USA",
      },
      paymentMethod: "PayPal",
      isPaid: true,
      status: "delivered",
      totalAmount: 249.98,
      discountAmount: 0,
      couponCode: "",
    },
  ];

  try {
    const orders = await Order.insertMany(ordersData);
    console.log(`✅ Created ${orders.length} orders`);

    // Log order summary
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const avgOrderValue = totalRevenue / orders.length;
    const paidOrders = orders.filter((order) => order.isPaid).length;

    console.log(`   - Total revenue: $${totalRevenue.toFixed(2)}`);
    console.log(`   - Average order value: $${avgOrderValue.toFixed(2)}`);
    console.log(`   - Paid orders: ${paidOrders}/${orders.length}`);

    return orders;
  } catch (error) {
    console.error("❌ Error seeding orders:", error);
    throw error;
  }
};
