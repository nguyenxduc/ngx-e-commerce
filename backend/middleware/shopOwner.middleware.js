import Shop from "../models/shop.model.js";

export const shopOwnerRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // If no shop ID in params, check if user has a shop
    if (!id) {
      const shop = await Shop.findOne({ ownerId: userId });
      if (!shop) {
        return res.status(404).json({
          success: false,
          error: "Shop not found for this seller",
        });
      }
      req.shop = shop;
      return next();
    }

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({
        success: false,
        error: "Shop not found",
      });
    }

    if (
      shop.ownerId.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Access denied - Not the shop owner",
      });
    }

    req.shop = shop;
    next();
  } catch (error) {
    console.error("Error in shopOwnerRoute middleware:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const sellerRoute = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Check if user is a seller
    if (req.user.role !== "seller" && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access denied - Seller privileges required",
      });
    }

    // Check if seller has a shop
    const shop = await Shop.findOne({ ownerId: userId });
    if (!shop) {
      return res.status(404).json({
        success: false,
        error: "Shop not found for this seller",
      });
    }

    // Add shop info to request for use in controllers
    req.shop = shop;
    next();
  } catch (error) {
    console.error("Error in sellerRoute middleware:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const productOwnerRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const Product = (await import("../models/product.model.js")).default;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Check if user is the product owner or admin
    if (
      product.seller.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Access denied - Not the product owner",
      });
    }

    req.product = product;
    next();
  } catch (error) {
    console.error("Error in productOwnerRoute middleware:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
