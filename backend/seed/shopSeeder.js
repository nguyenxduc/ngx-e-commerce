import Shop from "../models/shop.model.js";

export const seedShops = async (users) => {
  // Get seller users
  const sellers = users.filter((user) => user.role === "seller");

  const shopsData = [
    {
      name: "TechZone Electronics",
      description:
        "Premium electronics and gadgets store. We offer the latest smartphones, laptops, and accessories with competitive prices and excellent customer service.",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
      banner:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=300&fit=crop",
      address: "123 Tech Street, Silicon Valley, CA 94025",
      contactInfo: {
        phone: "+1-555-0123",
        email: "contact@techzone.com",
        website: "https://techzone.com",
      },
      businessInfo: {
        type: "Electronics Retail",
        registrationNumber: "TECH123456",
      },
      ownerId: sellers[0]._id, // John Electronics
      rating: 4.8,
      totalRatings: 156,
      followers: 89,
      isActive: true,
      status: "approved",
      approvedAt: new Date(),
    },
    {
      name: "Fashion Forward",
      description:
        "Trendy fashion boutique offering the latest styles in clothing, shoes, and accessories. From casual wear to formal attire, we have everything you need.",
      logo: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop",
      banner:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop",
      address: "456 Fashion Avenue, New York, NY 10001",
      contactInfo: {
        phone: "+1-555-0456",
        email: "hello@fashionforward.com",
        website: "https://fashionforward.com",
      },
      businessInfo: {
        type: "Fashion Retail",
        registrationNumber: "FASH789012",
      },
      ownerId: sellers[1]._id, // Sarah Fashion
      rating: 4.6,
      totalRatings: 203,
      followers: 145,
      isActive: true,
      status: "approved",
      approvedAt: new Date(),
    },
    {
      name: "Sports Elite",
      description:
        "Your one-stop shop for all sports equipment and outdoor gear. From professional sports gear to casual outdoor activities, we've got you covered.",
      logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
      banner:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=300&fit=crop",
      address: "789 Sports Drive, Los Angeles, CA 90210",
      contactInfo: {
        phone: "+1-555-0789",
        email: "info@sportselite.com",
        website: "https://sportselite.com",
      },
      businessInfo: {
        type: "Sports Equipment",
        registrationNumber: "SPRT345678",
      },
      ownerId: sellers[2]._id, // Mike Sports
      rating: 4.7,
      totalRatings: 178,
      followers: 112,
      isActive: true,
      status: "approved",
      approvedAt: new Date(),
    },
  ];

  try {
    const shops = await Shop.insertMany(shopsData);
    console.log(`✅ Created ${shops.length} shops`);

    // Update user shop references
    for (let i = 0; i < sellers.length; i++) {
      await sellers[i].updateOne({ shop: shops[i]._id });
    }

    // Log shop details for reference
    shops.forEach((shop) => {
      console.log(`   - ${shop.name}: ${shop.description.substring(0, 50)}...`);
    });

    return shops;
  } catch (error) {
    console.error("❌ Error seeding shops:", error);
    throw error;
  }
};
