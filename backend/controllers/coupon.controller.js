import Coupon from "../models/coupon.model.js";

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountPercentage,
      expirationDate,
      isActive = true,
    } = req.body;

    const existingCoupon = await Coupon.findOne({
      code,
      isActive: true,
    });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = new Coupon({
      code,
      discountPercentage,
      expirationDate,
      isActive,
    });

    const savedCoupon = await coupon.save();
    res.status(201).json({
      message: "Coupon created successfully",
      coupon: savedCoupon,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create coupon", error: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;

    const coupon = await Coupon.findOne({
      code,
      isActive: true,
    });
    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    const now = new Date();
    if (now > coupon.expirationDate) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    const discount = (amount * coupon.discountPercentage) / 100;

    res.json({
      valid: true,
      coupon,
      discount,
      finalAmount: amount - discount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to validate coupon", error: error.message });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true });
    res.json(coupons);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get coupons", error: error.message });
  }
};

export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json(coupon);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get coupon", error: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expirationDate, isActive } = req.body;

    const coupon = await Coupon.findById(req.params.id);
    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (code && code !== coupon.code) {
      const existingCoupon = await Coupon.findOne({
        code,
        isActive: true,
      });
      if (existingCoupon) {
        return res.status(400).json({ message: "Coupon code already exists" });
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

    res.json({
      message: "Coupon updated successfully",
      coupon: updatedCoupon,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update coupon", error: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    await Coupon.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete coupon", error: error.message });
  }
};
