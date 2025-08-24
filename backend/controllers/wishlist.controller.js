import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";

export const getUserWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price images rating stock isActive description",
    });

    if (!wishlist) {
      return res.json({
        wishlist: { items: [] },
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedItems = wishlist.items.slice(startIndex, endIndex);

    res.json({
      wishlist: {
        id: wishlist._id,
        items: paginatedItems,
        totalItems: wishlist.items.length,
      },
      pagination: {
        page,
        limit,
        total: wishlist.items.length,
        pages: Math.ceil(wishlist.items.length / limit),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get wishlist", error: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.isActive) {
      return res.status(400).json({ message: "Product is not available" });
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    const existingItem = wishlist.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    wishlist.items.push({
      product: productId,
      addedAt: new Date(),
    });

    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: "items.product",
      select: "name price images rating stock isActive",
    });

    res.status(201).json({
      message: "Product added to wishlist",
      wishlist: populatedWishlist,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add to wishlist", error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    const itemIndex = wishlist.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: "items.product",
      select: "name price images rating stock isActive",
    });

    res.json({
      message: "Product removed from wishlist",
      wishlist: populatedWishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove from wishlist",
      error: error.message,
    });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = [];
    await wishlist.save();

    res.json({ message: "Wishlist cleared successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to clear wishlist", error: error.message });
  }
};
