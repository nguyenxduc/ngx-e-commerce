import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Review from "../models/review.model.js";

// Lấy đơn hàng của seller
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    // Lấy tất cả sản phẩm của seller
    const sellerProducts = await Product.find({ seller: sellerId }).select(
      "_id"
    );
    const productIds = sellerProducts.map((product) => product._id);

    let query = {
      "orderItems.product": { $in: productIds },
    };

    // Filter theo trạng thái
    if (status === "paid") {
      query.isPaid = true;
    } else if (status === "unpaid") {
      query.isPaid = false;
    } else if (status === "delivered") {
      query.isDelivered = true;
    } else if (status === "pending") {
      query.isDelivered = false;
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("orderItems.product", "name image price brand seller")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Lọc chỉ lấy orderItems có sản phẩm của seller
    const filteredOrders = orders.map((order) => {
      const sellerOrderItems = order.orderItems.filter(
        (item) =>
          item.product &&
          item.product.seller &&
          item.product.seller.toString() === sellerId.toString()
      );

      const sellerTotal = sellerOrderItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      return {
        ...order.toObject(),
        orderItems: sellerOrderItems,
        sellerTotal,
      };
    });

    const total = await Order.countDocuments(query);

    res.json({
      orders: filteredOrders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.log("Error in getSellerOrders controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Thống kê bán hàng của seller
export const getSellerSalesStats = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Lấy tất cả sản phẩm của seller
    const sellerProducts = await Product.find({ seller: sellerId }).select(
      "_id"
    );
    const productIds = sellerProducts.map((product) => product._id);

    // Tổng đơn hàng có sản phẩm của seller
    const totalOrders = await Order.countDocuments({
      "orderItems.product": { $in: productIds },
    });

    const ordersThisMonth = await Order.countDocuments({
      "orderItems.product": { $in: productIds },
      createdAt: { $gte: startOfMonth },
    });

    const ordersThisYear = await Order.countDocuments({
      "orderItems.product": { $in: productIds },
      createdAt: { $gte: startOfYear },
    });

    // Tính doanh thu
    const allOrders = await Order.find({
      "orderItems.product": { $in: productIds },
      isPaid: true,
    }).populate("orderItems.product", "price seller");

    let totalRevenue = 0;
    let revenueThisMonth = 0;
    let revenueThisYear = 0;

    allOrders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (
          item.product &&
          item.product.seller &&
          item.product.seller.toString() === sellerId.toString()
        ) {
          const itemRevenue = item.product.price * item.quantity;
          totalRevenue += itemRevenue;

          if (order.createdAt >= startOfMonth) {
            revenueThisMonth += itemRevenue;
          }

          if (order.createdAt >= startOfYear) {
            revenueThisYear += itemRevenue;
          }
        }
      });
    });

    // Đơn hàng chờ xử lý
    const pendingOrders = await Order.countDocuments({
      "orderItems.product": { $in: productIds },
      isPaid: false,
    });

    // Đơn hàng đã giao
    const deliveredOrders = await Order.countDocuments({
      "orderItems.product": { $in: productIds },
      isDelivered: true,
    });

    // Thống kê feedback
    const sellerReviews = await Review.find({
      product: { $in: productIds },
    });

    const averageRating =
      sellerReviews.length > 0
        ? sellerReviews.reduce((sum, review) => sum + review.rating, 0) /
          sellerReviews.length
        : 0;

    res.json({
      totalOrders,
      ordersThisMonth,
      ordersThisYear,
      totalRevenue,
      revenueThisMonth,
      revenueThisYear,
      pendingOrders,
      deliveredOrders,
      totalReviews: sellerReviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
    });
  } catch (error) {
    console.log("Error in getSellerSalesStats controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Lấy feedback của seller
export const getSellerReviews = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    // Lấy tất cả sản phẩm của seller
    const sellerProducts = await Product.find({ seller: sellerId }).select(
      "_id"
    );
    const productIds = sellerProducts.map((product) => product._id);

    const reviews = await Review.find({ product: { $in: productIds } })
      .populate("user", "name")
      .populate("product", "name image")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ product: { $in: productIds } });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.log("Error in getSellerReviews controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng của seller
export const updateSellerOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { isDelivered } = req.body;
    const sellerId = req.user._id;

    const order = await Order.findById(orderId).populate(
      "orderItems.product",
      "seller"
    );

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Kiểm tra xem đơn hàng có chứa sản phẩm của seller không
    const hasSellerProduct = order.orderItems.some(
      (item) =>
        item.product &&
        item.product.seller &&
        item.product.seller.toString() === sellerId.toString()
    );

    if (!hasSellerProduct) {
      return res
        .status(403)
        .json({ message: "Không có quyền cập nhật đơn hàng này" });
    }

    // Cập nhật trạng thái giao hàng
    if (isDelivered !== undefined) {
      order.isDelivered = isDelivered;
      if (isDelivered) {
        order.deliveredAt = new Date();
      }
    }

    await order.save();

    await order.populate("user", "name email");
    await order.populate("orderItems.product", "name image price brand");

    res.json(order);
  } catch (error) {
    console.log("Error in updateSellerOrderStatus controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
