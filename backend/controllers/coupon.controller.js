import Coupon from "../models/coupon.model.js";

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountPercentage,
      expirationDate,
      isActive = true,
    } = req.body;

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ error: "Coupon code already exists" });
    }

    const coupon = new Coupon({
      code,
      discountPercentage,
      expirationDate,
      isActive,
    });

    const savedCoupon = await coupon.save();
    res.status(201).json(savedCoupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code });
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;

    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ error: "Invalid coupon code" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ error: "Coupon is not active" });
    }

    const now = new Date();
    if (now > coupon.expirationDate) {
      return res.status(400).json({ error: "Coupon has expired" });
    }

    const discount = (amount * coupon.discountPercentage) / 100;

    res.json({
      valid: true,
      coupon,
      discount,
      finalAmount: amount - discount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const coupons = await Coupon.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Coupon.countDocuments();

    res.json({
      coupons,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCoupons: total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expirationDate, isActive } = req.body;

    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    if (code && code !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code });
      if (existingCoupon) {
        return res.status(400).json({ error: "Coupon code already exists" });
      }
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      {
        code,
        discountPercentage,
        expirationDate,
        isActive,
      },
      { new: true }
    );

    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCouponStats = async (req, res) => {
  try {
    const totalCoupons = await Coupon.countDocuments();
    const activeCoupons = await Coupon.countDocuments({ isActive: true });
    const expiredCoupons = await Coupon.countDocuments({
      expirationDate: { $lt: new Date() },
    });

    res.json({
      totalCoupons,
      activeCoupons,
      expiredCoupons,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;

    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ error: "Invalid coupon code" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ error: "Coupon is not active" });
    }

    const now = new Date();
    if (now > coupon.expirationDate) {
      return res.status(400).json({ error: "Coupon has expired" });
    }

    const discount = (amount * coupon.discountPercentage) / 100;

    res.json({
      success: true,
      coupon,
      discount,
      finalAmount: amount - discount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserCoupons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      expirationDate: { $gte: now },
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Coupon.countDocuments({
      isActive: true,
      expirationDate: { $gte: now },
    });

    res.json({
      coupons,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCoupons: total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
