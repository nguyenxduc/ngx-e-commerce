import User from "../models/user.model.js";

export const seedUsers = async () => {
  const usersData = [
    // Admin user
    {
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      phone: "+1234567890",
    },

    // Seller users
    {
      name: "John Electronics",
      email: "john@electronics.com",
      password: "seller123",
      role: "seller",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      phone: "+1234567891",
    },
    {
      name: "Sarah Fashion",
      email: "sarah@fashion.com",
      password: "seller123",
      role: "seller",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      phone: "+1234567892",
    },
    {
      name: "Mike Sports",
      email: "mike@sports.com",
      password: "seller123",
      role: "seller",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      phone: "+1234567893",
    },

    // Customer users
    {
      name: "Alice Customer",
      email: "alice@customer.com",
      password: "customer123",
      role: "customer",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      phone: "+1234567894",
    },
    {
      name: "Bob Customer",
      email: "bob@customer.com",
      password: "customer123",
      role: "customer",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      phone: "+1234567895",
    },
    {
      name: "Carol Customer",
      email: "carol@customer.com",
      password: "customer123",
      role: "customer",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      phone: "+1234567896",
    },
    {
      name: "David Customer",
      email: "david@customer.com",
      password: "customer123",
      role: "customer",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      phone: "+1234567897",
    },
  ];

  try {
    // Use create() instead of insertMany() to trigger pre-save hooks
    const users = [];
    for (const userData of usersData) {
      const user = await User.create(userData);
      users.push(user);
    }

    console.log(`✅ Created ${users.length} users`);

    // Log user details for reference
    users.forEach((user) => {
      console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
    });

    return users;
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
};
