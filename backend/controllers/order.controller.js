import { prisma } from "../lib/db.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, shipping_address, payment_method, coupon_code } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    // validate products and compute totals
    let totalAmount = 0;
    const orderItemsData = [];
    for (const it of items) {
      const product = await prisma.product.findFirst({
        where: { id: BigInt(it.product_id), deleted_at: null },
      });
      if (!product)
        return res
          .status(400)
          .json({ message: `Product ${it.product_id} not found` });
      if (product.quantity < it.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });
      }
      const unitPrice = product.price;
      const totalPrice = Number(unitPrice) * Number(it.quantity);
      totalAmount += totalPrice;
      orderItemsData.push({
        product_id: BigInt(it.product_id),
        quantity: it.quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        color: it.color ?? null,
      });
    }

    // apply coupon if provided (optional)
    let couponId = null;
    if (coupon_code) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: coupon_code },
      });
      if (coupon) couponId = coupon.id;
    }

    // Parse shipping_address if it's a string
    let parsedShippingAddress = shipping_address;
    if (typeof shipping_address === 'string') {
      try {
        parsedShippingAddress = JSON.parse(shipping_address);
      } catch {
        parsedShippingAddress = shipping_address;
      }
    }

    const created = await prisma.order.create({
      data: {
        user_id: BigInt(userId),
        order_number: `ORD-${Date.now()}`,
        total_amount: totalAmount,
        status: "pending",
        shipping_address: parsedShippingAddress ?? null,
        payment_method: payment_method ?? null,
        coupon_id: couponId,
        order_items: { createMany: { data: orderItemsData } },
      },
      include: { order_items: true },
    });

    // decrement stock and increment sold
    for (const it of orderItemsData) {
      await prisma.product.update({
        where: { id: it.product_id },
        data: {
          quantity: { decrement: it.quantity },
          sold: { increment: it.quantity },
        },
      });
    }

    res
      .status(201)
      .json({ message: "Order created successfully", order: created });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    //const userId = req.user.id;

    const order = await prisma.order.findFirst({
      where: { id: BigInt(id), deleted_at: null },
      include: {
        user: { select: { id: true, name: true, email: true } },
        order_items: {
          include: { product: { select: { id: true, name: true, img: true } } },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // if (order.user_id.toString() !== userId && req.user.role !== "admin") {
    //   return res
    //     .status(403)
    //     .json({ message: "Not authorized to view this order" });
    // }

    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get order", error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { user_id: BigInt(userId), deleted_at: null },
      orderBy: { created_at: "desc" },
      include: { order_items: true },
    });
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get user orders", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, q } = req.query;

    const where = { deleted_at: null };
    if (status) where.status = String(status);
    if (q) where.order_number = { contains: String(q), mode: "insensitive" };

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        orderBy: { created_at: "desc" },
        include: {
          order_items: true,
          user: { select: { id: true, name: true, email: true } },
        },
        skip,
        take,
      }),
    ]);

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.max(1, Math.ceil(total / Number(limit))),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get all orders", error: error.message });
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
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await prisma.order.findFirst({
      where: { id: BigInt(id), deleted_at: null },
      include: { order_items: true },
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === "cancelled" && order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Cannot cancel order in current status" });
    }

    if (status === "cancelled" && order.status === "pending") {
      for (const item of order.order_items) {
        await prisma.product.update({
          where: { id: item.product_id },
          data: {
            quantity: { increment: item.quantity },
            sold: { decrement: item.quantity },
          },
        });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: BigInt(id) },
      data: { status },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    res.json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update order status", error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { id: BigInt(id), deleted_at: null },
      include: { order_items: true },
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Cannot delete order in current status" });
    }

    for (const item of order.order_items) {
      await prisma.product.update({
        where: { id: item.product_id },
        data: {
          quantity: { increment: item.quantity },
          sold: { decrement: item.quantity },
        },
      });
    }

    await prisma.order.update({
      where: { id: BigInt(id) },
      data: { deleted_at: new Date() },
    });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete order", error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const order = await prisma.order.findFirst({
      where: { id: BigInt(id), deleted_at: null },
      include: { order_items: true },
    });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    if (order.user_id.toString() !== userId && req.user.role !== "admin")
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    if (!["pending", "confirmed"].includes(order.status || ""))
      return res
        .status(400)
        .json({ success: false, message: "Cannot cancel in current status" });

    for (const item of order.order_items) {
      await prisma.product.update({
        where: { id: item.product_id },
        data: {
          quantity: { increment: item.quantity },
          sold: { decrement: item.quantity },
        },
      });
    }

    const updated = await prisma.order.update({
      where: { id: BigInt(id) },
      data: { status: "cancelled" },
    });
    res.json({ success: true, message: "Order cancelled", order: updated });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};

export const getOrderStats = async (_req, res) => {
  try {
    const whereActive = { deleted_at: null };
    const [total_orders, pending_orders, revenueRows, recent_orders] =
      await Promise.all([
        prisma.order.count({ where: whereActive }),
        prisma.order.count({ where: { status: "pending", deleted_at: null } }),
        prisma.order.aggregate({
          _sum: { total_amount: true },
          where: whereActive,
        }),
        prisma.order.findMany({
          orderBy: { created_at: "desc" },
          take: 10,
          where: whereActive,
          include: { user: { select: { id: true, name: true } } },
        }),
      ]);
    const revenue = Number(revenueRows._sum.total_amount || 0);
    res.json({ total_orders, pending_orders, revenue, recent_orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get stats", error: error.message });
  }
};
