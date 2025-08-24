import Coupon from "../models/coupon.model.js";

export const seedCoupons = async () => {
  const couponsData = [
    {
      code: "WELCOME10",
      discountPercentage: 10,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
    },
    {
      code: "SAVE20",
      discountPercentage: 20,
      expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      isActive: true,
    },
    {
      code: "FLASH25",
      discountPercentage: 25,
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isActive: true,
    },
    {
      code: "NEWUSER15",
      discountPercentage: 15,
      expirationDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      isActive: true,
    },
    {
      code: "SUMMER30",
      discountPercentage: 30,
      expirationDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      isActive: true,
    },
    {
      code: "EXPIRED50",
      discountPercentage: 50,
      expirationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (expired)
      isActive: false,
    },
  ];

  try {
    const coupons = await Coupon.insertMany(couponsData);
    console.log(`✅ Created ${coupons.length} coupons`);

    // Log coupon details for reference
    coupons.forEach((coupon) => {
      const status = coupon.isActive ? "Active" : "Inactive";
      console.log(
        `   - ${coupon.code}: ${coupon.discountPercentage}% off (${status})`
      );
    });

    return coupons;
  } catch (error) {
    console.error("❌ Error seeding coupons:", error);
    throw error;
  }
};
