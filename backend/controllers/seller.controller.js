import User from "../models/user.model.js";
import Shop from "../models/shop.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import Review from "../models/review.model.js";

export const getSellerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    res.json({
      success: true,
      data: {
        user,
        shop: req.shop,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateSellerProfile = async (req, res) => {
  try {
    const { name, email, phone, avatar, bio } = req.body;
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, avatar, bio },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getSellerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const shop = req.shop;

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayOrders = await Order.countDocuments({
      "items.shopId": shop._id,
      createdAt: { $gte: startOfDay },
    });

    const monthOrders = await Order.countDocuments({
      "items.shopId": shop._id,
      createdAt: { $gte: startOfMonth },
    });

    const totalProducts = await Product.countDocuments({ shop: shop._id });

    const totalRevenue = await Order.aggregate([
      { $match: { "items.shopId": shop._id, status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const recentOrders = await Order.find({ "items.shopId": shop._id })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        shop,
        stats: {
          todayOrders,
          monthOrders,
          totalProducts,
          totalRevenue: totalRevenue[0]?.total || 0,
        },
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const shop = req.shop;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    let query = { "items.shopId": shop._id };
    if (status) {
      query.status = status;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.product", "name images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const shop = req.shop;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ shop: shop._id })
      .populate("category", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({ shop: shop._id });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getSellerAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const shop = req.shop;

    const { period = "month" } = req.query;
    const now = new Date();
    let startDate;

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const orders = await Order.find({
      "items.shopId": shop._id,
      createdAt: { $gte: startDate },
    });

    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const orderCount = orders.length;

    const topProducts = await Order.aggregate([
      { $match: { "items.shopId": shop._id, createdAt: { $gte: startDate } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        period,
        stats: {
          revenue,
          orderCount,
          averageOrderValue: orderCount > 0 ? revenue / orderCount : 0,
        },
        topProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getSellerEarnings = async (req, res) => {
  try {
    const userId = req.user.id;
    const shop = req.shop;

    const { startDate, endDate } = req.query;
    let query = { "items.shopId": shop._id, status: "completed" };

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const orders = await Order.find(query);
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const commission = totalRevenue * 0.1;
    const netEarnings = totalRevenue - commission;

    const monthlyEarnings = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      data: {
        totalRevenue,
        commission,
        netEarnings,
        monthlyEarnings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getSellerCustomers = async (req, res) => {
  try {
    const userId = req.user.id;
    const shop = req.shop;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const customers = await Order.aggregate([
      { $match: { "items.shopId": shop._id } },
      {
        $group: {
          _id: "$user",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          lastOrder: { $max: "$createdAt" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          name: "$user.name",
          email: "$user.email",
          avatar: "$user.avatar",
          totalOrders: 1,
          totalSpent: 1,
          lastOrder: 1,
        },
      },
    ]);

    const total = await Order.distinct("user", {
      "items.shopId": shop._id,
    }).then((ids) => ids.length);

    res.json({
      success: true,
      data: {
        customers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getSellerShopStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const shop = req.shop;

    const totalProducts = await Product.countDocuments({ shop: shop._id });
    const totalOrders = await Order.countDocuments({
      "items.shopId": shop._id,
    });
    const totalRevenue = await Order.aggregate([
      { $match: { "items.shopId": shop._id, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const averageRating = await Review.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      { $match: { "product.shop": shop._id } },
      { $group: { _id: null, average: { $avg: "$rating" } } },
    ]);

    res.json({
      success: true,
      data: {
        shop,
        stats: {
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          averageRating: averageRating[0]?.average || 0,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getSellerReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const shop = req.shop;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      { $match: { "product.shop": shop._id } },
      { $skip: skip },
      { $limit: limit },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          rating: 1,
          comment: 1,
          createdAt: 1,
          productName: "$product.name",
          userName: "$user.name",
          userAvatar: "$user.avatar",
        },
      },
    ]);

    const total = await Review.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      { $match: { "product.shop": shop._id } },
      { $count: "total" },
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total: total[0]?.total || 0,
          pages: Math.ceil((total[0]?.total || 0) / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
