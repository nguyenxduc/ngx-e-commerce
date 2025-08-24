import Product from "../models/product.model.js";

export const seedProducts = async (users, productTypes, shops) => {
  const productsData = [
    // Electronics - TechZone
    {
      name: "iPhone 15 Pro",
      description:
        "Latest iPhone with A17 Pro chip, 48MP camera, and titanium design. Perfect for photography and gaming.",
      price: 999.99,
      image:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
      category: productTypes.find((pt) => pt.name === "Electronics")._id,
      shop: shops[0]._id, // TechZone
      countInStock: 25,
      ratings: 4.9,
      numReviews: 89,
      isActive: true,
    },
    {
      name: "MacBook Air M2",
      description:
        "Ultra-thin laptop with M2 chip, 13.6-inch display, and all-day battery life. Perfect for work and creativity.",
      price: 1199.99,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
      category: productTypes.find((pt) => pt.name === "Electronics")._id,
      shop: shops[0]._id,
      countInStock: 15,
      ratings: 4.8,
      numReviews: 67,
      isActive: true,
    },
    {
      name: "Sony WH-1000XM5",
      description:
        "Premium noise-canceling headphones with exceptional sound quality and 30-hour battery life.",
      price: 399.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      category: productTypes.find((pt) => pt.name === "Electronics")._id,
      shop: shops[0]._id,
      countInStock: 30,
      ratings: 4.7,
      numReviews: 123,
      isActive: true,
    },

    // Fashion - Fashion Forward
    {
      name: "Classic Denim Jacket",
      description:
        "Timeless denim jacket perfect for any casual occasion. Made from premium cotton denim with comfortable fit.",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop",
      category: productTypes.find((pt) => pt.name === "Fashion")._id,
      shop: shops[1]._id, // Fashion Forward
      countInStock: 50,
      ratings: 4.5,
      numReviews: 156,
      isActive: true,
    },
    {
      name: "Leather Crossbody Bag",
      description:
        "Elegant leather crossbody bag with adjustable strap. Perfect for everyday use with multiple compartments.",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
      category: productTypes.find((pt) => pt.name === "Fashion")._id,
      shop: shops[1]._id,
      countInStock: 35,
      ratings: 4.6,
      numReviews: 89,
      isActive: true,
    },
    {
      name: "Running Shoes",
      description:
        "Lightweight running shoes with superior cushioning and breathable mesh upper. Ideal for daily runs and workouts.",
      price: 149.99,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      category: productTypes.find((pt) => pt.name === "Fashion")._id,
      shop: shops[1]._id,
      countInStock: 40,
      ratings: 4.4,
      numReviews: 234,
      isActive: true,
    },

    // Sports - Sports Elite
    {
      name: "Basketball",
      description:
        "Official size and weight basketball with excellent grip and durability. Perfect for indoor and outdoor courts.",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop",
      category: productTypes.find((pt) => pt.name === "Sports & Outdoors")._id,
      shop: shops[2]._id, // Sports Elite
      countInStock: 60,
      ratings: 4.3,
      numReviews: 178,
      isActive: true,
    },
    {
      name: "Yoga Mat",
      description:
        "Premium non-slip yoga mat with excellent cushioning. Perfect for yoga, pilates, and home workouts.",
      price: 39.99,
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
      category: productTypes.find((pt) => pt.name === "Sports & Outdoors")._id,
      shop: shops[2]._id,
      countInStock: 45,
      ratings: 4.7,
      numReviews: 92,
      isActive: true,
    },
    {
      name: "Tennis Racket",
      description:
        "Professional tennis racket with excellent control and power. Suitable for intermediate to advanced players.",
      price: 199.99,
      image:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
      category: productTypes.find((pt) => pt.name === "Sports & Outdoors")._id,
      shop: shops[2]._id,
      countInStock: 20,
      ratings: 4.8,
      numReviews: 67,
      isActive: true,
    },

    // More Electronics from TechZone
    {
      name: "iPad Air",
      description:
        "Powerful tablet with M1 chip, 10.9-inch display, and Apple Pencil support. Perfect for creativity and productivity.",
      price: 599.99,
      image:
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
      category: productTypes.find((pt) => pt.name === "Electronics")._id,
      shop: shops[0]._id,
      countInStock: 18,
      ratings: 4.6,
      numReviews: 45,
      isActive: true,
    },
    {
      name: "Gaming Mouse",
      description:
        "High-precision gaming mouse with customizable RGB lighting and programmable buttons. Perfect for gamers.",
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
      category: productTypes.find((pt) => pt.name === "Electronics")._id,
      shop: shops[0]._id,
      countInStock: 35,
      ratings: 4.5,
      numReviews: 78,
      isActive: true,
    },

    // More Fashion from Fashion Forward
    {
      name: "Summer Dress",
      description:
        "Lightweight summer dress with floral pattern. Perfect for warm weather and casual outings.",
      price: 69.99,
      image:
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
      category: productTypes.find((pt) => pt.name === "Fashion")._id,
      shop: shops[1]._id,
      countInStock: 55,
      ratings: 4.4,
      numReviews: 112,
      isActive: true,
    },
    {
      name: "Sunglasses",
      description:
        "Stylish sunglasses with UV protection and polarized lenses. Available in multiple colors and sizes.",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
      category: productTypes.find((pt) => pt.name === "Fashion")._id,
      shop: shops[1]._id,
      countInStock: 40,
      ratings: 4.3,
      numReviews: 89,
      isActive: true,
    },

    // More Sports from Sports Elite
    {
      name: "Dumbbells Set",
      description:
        "Adjustable dumbbells set with weight range from 5-50 lbs. Perfect for home gym and strength training.",
      price: 299.99,
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      category: productTypes.find((pt) => pt.name === "Sports & Outdoors")._id,
      shop: shops[2]._id,
      countInStock: 12,
      ratings: 4.9,
      numReviews: 34,
      isActive: true,
    },
    {
      name: "Cycling Helmet",
      description:
        "Lightweight cycling helmet with excellent ventilation and safety certification. Perfect for road and mountain biking.",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&h=400&fit=crop",
      category: productTypes.find((pt) => pt.name === "Sports & Outdoors")._id,
      shop: shops[2]._id,
      countInStock: 25,
      ratings: 4.6,
      numReviews: 56,
      isActive: true,
    },
  ];

  try {
    const products = await Product.insertMany(productsData);
    console.log(`✅ Created ${products.length} products`);

    // Log product details for reference
    products.forEach((product) => {
      console.log(
        `   - ${product.name}: $${product.price} (${product.countInStock} in stock)`
      );
    });

    return products;
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error;
  }
};
