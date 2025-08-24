import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import {
  successResponse,
  errorResponse,
  validationError,
  notFoundError,
  paginatedResponse,
} from "../utils/response.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod, couponCode } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price countInStock isActive shop",
    });

    if (!cart || cart.items.length === 0) {
      return validationError(res, "Cart is empty");
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.product;
      if (!product.isActive) {
        return validationError(res, `Product ${product.name} is not available`);
      }

      if (product.countInStock < item.quantity) {
        return validationError(
          res,
          `Insufficient stock for ${product.name}. Available: ${product.countInStock}, Requested: ${item.quantity}`
        );
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        total: product.price * item.quantity,
        shopId: product.shop,
      });

      totalAmount += product.price * item.quantity;

      await Product.findByIdAndUpdate(product._id, {
        $inc: { countInStock: -item.quantity },
      });
    }

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      couponCode,
      discountAmount: 0,
    });

    await order.save();

    cart.items = [];
    await cart.save();

    const populatedOrder = await Order.findById(order._id).populate({
      path: "user",
      select: "name email",
    });

    return successResponse(
      res,
      populatedOrder,
      "Order created successfully",
      201
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(id)
      .populate({
        path: "user",
        select: "name email",
      })
      .populate({
        path: "items.product",
        select: "name image description",
      });

    if (!order) {
      return notFoundError(res, "Order not found");
    }

    if (order.user._id.toString() !== userId && req.user.role !== "admin") {
      return validationError(res, "Not authorized to view this order");
    }

    return successResponse(res, order);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate({
        path: "items.product",
        select: "name image",
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    return paginatedResponse(res, orders, pagination);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const userId = req.query.userId;

    const query = {};
    if (status) query.status = status;
    if (userId) query.user = userId;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate({
        path: "user",
        select: "name email",
      })
      .populate({
        path: "items.product",
        select: "name image",
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    return paginatedResponse(res, orders, pagination);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return validationError(res, "Invalid status");
    }

    const order = await Order.findById(id);
    if (!order) {
      return notFoundError(res, "Order not found");
    }

    if (status === "cancelled" && order.status !== "pending") {
      return validationError(res, "Cannot cancel order in current status");
    }

    // If cancelling order, restore product stock
    if (status === "cancelled" && order.status === "pending") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { countInStock: item.quantity },
        });
      }
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(id).populate({
      path: "user",
      select: "name email",
    });

    return successResponse(
      res,
      updatedOrder,
      "Order status updated successfully"
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return notFoundError(res, "Order not found");
    }

    if (order.status !== "pending") {
      return validationError(res, "Cannot delete order in current status");
    }

    // Restore product stock when deleting pending order
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: item.quantity },
      });
    }

    await Order.findByIdAndDelete(id);

    return successResponse(res, null, "Order deleted successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      totalOrders,
      totalRevenue,
      monthlyOrders,
      monthlyRevenue,
      yearlyOrders,
      yearlyRevenue,
      statusCounts,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.countDocuments({ createdAt: { $gte: startOfYear } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfYear } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);

    const stats = {
      total: {
        orders: totalOrders,
        revenue: totalRevenue[0]?.total || 0,
      },
      monthly: {
        orders: monthlyOrders,
        revenue: monthlyRevenue[0]?.total || 0,
      },
      yearly: {
        orders: yearlyOrders,
        revenue: yearlyRevenue[0]?.total || 0,
      },
      statusBreakdown: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };

    return successResponse(res, stats);
  } catch (error) {
    return errorResponse(res, error);
  }
};
