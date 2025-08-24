import Review from "../models/review.model.js";

export const seedReviews = async (users, products) => {
  const customers = users.filter((user) => user.role === "customer");

  const reviewsData = [
    // iPhone 15 Pro reviews
    {
      user: customers[0]._id,
      product: products[0]._id, // iPhone 15 Pro
      rating: 5,
      comment:
        "Amazing phone! The camera quality is incredible and the performance is top-notch.",
    },
    {
      user: customers[1]._id,
      product: products[0]._id,
      rating: 4,
      comment:
        "Great phone overall, but the battery could be better. Camera is excellent though.",
    },
    {
      user: customers[2]._id,
      product: products[0]._id,
      rating: 5,
      comment:
        "Best iPhone I've ever owned. The titanium design is beautiful and it's super fast.",
    },

    // MacBook Air M2 reviews
    {
      user: customers[0]._id,
      product: products[1]._id, // MacBook Air M2
      rating: 5,
      comment:
        "Perfect laptop for work and creativity. The M2 chip is incredibly fast.",
    },
    {
      user: customers[3]._id,
      product: products[1]._id,
      rating: 4,
      comment:
        "Excellent performance and battery life. Only giving 4 stars because of the price.",
    },

    // Sony Headphones reviews
    {
      user: customers[1]._id,
      product: products[2]._id, // Sony WH-1000XM5
      rating: 5,
      comment:
        "Best noise-canceling headphones I've ever used. Sound quality is amazing.",
    },
    {
      user: customers[2]._id,
      product: products[2]._id,
      rating: 4,
      comment:
        "Great headphones, very comfortable for long listening sessions.",
    },

    // Denim Jacket reviews
    {
      user: customers[0]._id,
      product: products[3]._id, // Classic Denim Jacket
      rating: 4,
      comment: "Perfect fit and great quality denim. Goes with everything!",
    },
    {
      user: customers[3]._id,
      product: products[3]._id,
      rating: 5,
      comment:
        "Love this jacket! The fit is perfect and it's very comfortable.",
    },

    // Leather Bag reviews
    {
      user: customers[1]._id,
      product: products[4]._id, // Leather Crossbody Bag
      rating: 5,
      comment:
        "Beautiful leather bag with great craftsmanship. Perfect size for everyday use.",
    },

    // Running Shoes reviews
    {
      user: customers[2]._id,
      product: products[5]._id, // Running Shoes
      rating: 4,
      comment: "Great running shoes, very comfortable and supportive.",
    },
    {
      user: customers[0]._id,
      product: products[5]._id,
      rating: 5,
      comment:
        "Perfect for my daily runs. Excellent cushioning and breathability.",
    },

    // Basketball reviews
    {
      user: customers[1]._id,
      product: products[6]._id, // Basketball
      rating: 4,
      comment: "Good quality basketball, great grip and bounce.",
    },
    {
      user: customers[3]._id,
      product: products[6]._id,
      rating: 5,
      comment:
        "Perfect basketball for indoor and outdoor courts. Highly recommend!",
    },

    // Yoga Mat reviews
    {
      user: customers[0]._id,
      product: products[7]._id, // Yoga Mat
      rating: 5,
      comment: "Excellent yoga mat with great cushioning and non-slip surface.",
    },

    // Tennis Racket reviews
    {
      user: customers[2]._id,
      product: products[8]._id, // Tennis Racket
      rating: 4,
      comment:
        "Great tennis racket with good control and power. Perfect for intermediate players.",
    },

    // iPad Air reviews
    {
      user: customers[1]._id,
      product: products[9]._id, // iPad Air
      rating: 5,
      comment: "Amazing tablet! Perfect for drawing and productivity tasks.",
    },

    // Gaming Mouse reviews
    {
      user: customers[3]._id,
      product: products[10]._id, // Gaming Mouse
      rating: 4,
      comment:
        "Great gaming mouse with precise tracking and comfortable design.",
    },

    // Summer Dress reviews
    {
      user: customers[0]._id,
      product: products[11]._id, // Summer Dress
      rating: 5,
      comment:
        "Beautiful summer dress with perfect fit and comfortable fabric.",
    },

    // Sunglasses reviews
    {
      user: customers[2]._id,
      product: products[12]._id, // Sunglasses
      rating: 4,
      comment: "Stylish sunglasses with good UV protection. Love the design!",
    },

    // Dumbbells Set reviews
    {
      user: customers[1]._id,
      product: products[13]._id, // Dumbbells Set
      rating: 5,
      comment:
        "Perfect dumbbells set for home workouts. Great quality and easy to adjust.",
    },

    // Cycling Helmet reviews
    {
      user: customers[3]._id,
      product: products[14]._id, // Cycling Helmet
      rating: 4,
      comment: "Comfortable and safe cycling helmet with good ventilation.",
    },
  ];

  try {
    const reviews = await Review.insertMany(reviewsData);
    console.log(`✅ Created ${reviews.length} reviews`);

    // Log review summary
    const avgRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    console.log(`   - Average rating: ${avgRating.toFixed(1)}/5`);
    console.log(`   - Total reviews: ${reviews.length}`);

    return reviews;
  } catch (error) {
    console.error("❌ Error seeding reviews:", error);
    throw error;
  }
};
