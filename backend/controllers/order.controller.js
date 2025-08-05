import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

// Tạo đơn hàng mới
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    } = req.body;

    const userId = req.user._id;

    // Kiểm tra tồn kho
    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          message: `Sản phẩm ${item.product} không tồn tại`,
        });
      }
      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm ${product.name} chỉ còn ${product.countInStock} trong kho`,
        });
      }
    }

    // Tạo đơn hàng
    const order = await Order.create({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    // Cập nhật số lượng tồn kho
    for (let item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: -item.quantity },
      });
    }

    await order.populate("user", "name email");
    await order.populate("orderItems.product", "name image price");

    res.status(201).json(order);
  } catch (error) {
    console.log("Error in createOrder controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Lấy đơn hàng theo ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("orderItems.product", "name image price brand");

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Kiểm tra quyền (chỉ chủ đơn hàng hoặc admin mới được xem)
    if (order.user._id.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền xem đơn hàng này" });
    }

    res.json(order);
  } catch (error) {
    console.log("Error in getOrderById controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả đơn hàng của user hiện tại
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    let query = { user: userId };
    if (status) {
      query.isDelivered = status === "delivered";
    }

    const orders = await Order.find(query)
      .populate("orderItems.product", "name image price")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.log("Error in getUserOrders controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả đơn hàng (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;

    let query = {};
    if (status) {
      query.isDelivered = status === "delivered";
    }
    if (userId) {
      query.user = userId;
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("orderItems.product", "name image price")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.log("Error in getAllOrders controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPaid, isDelivered, paymentResult } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Cập nhật trạng thái thanh toán
    if (isPaid !== undefined) {
      order.isPaid = isPaid;
      if (isPaid) {
        order.paidAt = new Date();
      }
    }

    // Cập nhật thông tin thanh toán
    if (paymentResult) {
      order.paymentResult = paymentResult;
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
    await order.populate("orderItems.product", "name image price");

    res.json(order);
  } catch (error) {
    console.log("Error in updateOrderStatus controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Xóa đơn hàng
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    // Hoàn trả số lượng tồn kho nếu đơn hàng chưa được giao
    if (!order.isDelivered) {
      for (let item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { countInStock: item.quantity },
        });
      }
    }

    await Order.findByIdAndDelete(id);

    res.json({ message: "Đơn hàng đã được xóa thành công" });
  } catch (error) {
    console.log("Error in deleteOrder controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Thống kê đơn hàng
export const getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Tổng đơn hàng
    const totalOrders = await Order.countDocuments();
    const ordersThisMonth = await Order.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const ordersThisYear = await Order.countDocuments({
      createdAt: { $gte: startOfYear },
    });

    // Tổng doanh thu
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const revenueThisMonth = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: startOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const revenueThisYear = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: startOfYear },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    // Đơn hàng chờ xử lý
    const pendingOrders = await Order.countDocuments({
      isPaid: false,
    });

    // Đơn hàng đã giao
    const deliveredOrders = await Order.countDocuments({
      isDelivered: true,
    });

    res.json({
      totalOrders,
      ordersThisMonth,
      ordersThisYear,
      totalRevenue: totalRevenue[0]?.total || 0,
      revenueThisMonth: revenueThisMonth[0]?.total || 0,
      revenueThisYear: revenueThisYear[0]?.total || 0,
      pendingOrders,
      deliveredOrders,
    });
  } catch (error) {
    console.log("Error in getOrderStats controller", error.message);
    res.status(500).json({ message: error.message });
  }
}; 