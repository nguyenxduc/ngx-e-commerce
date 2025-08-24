import ProductType from "../models/productType.model.js";

export const seedProductTypes = async () => {
  const productTypesData = [
    {
      name: "Electronics",
      description: "Electronic devices and gadgets",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    },
    {
      name: "Fashion",
      description: "Clothing, shoes, and accessories",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
    },
    {
      name: "Sports & Outdoors",
      description: "Sports equipment and outdoor gear",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    },
    {
      name: "Home & Garden",
      description: "Home decor and gardening supplies",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    },
    {
      name: "Books & Media",
      description: "Books, movies, and music",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    },
    {
      name: "Health & Beauty",
      description: "Health products and beauty supplies",
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
    },
    {
      name: "Toys & Games",
      description: "Toys, games, and entertainment",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    },
    {
      name: "Automotive",
      description: "Car parts and accessories",
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
    },
  ];

  try {
    const productTypes = await ProductType.insertMany(productTypesData);
    console.log(`✅ Created ${productTypes.length} product types`);

    // Log product type details for reference
    productTypes.forEach((type) => {
      console.log(`   - ${type.name}: ${type.description}`);
    });

    return productTypes;
  } catch (error) {
    console.error("❌ Error seeding product types:", error);
    throw error;
  }
};
