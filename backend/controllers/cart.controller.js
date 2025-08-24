import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { product, quantity = 1 } = req.body;
    const userId = req.user.id;

    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (productDoc.status && productDoc.status !== "active") {
      return res.status(400).json({ message: "Product is not available" });
    }

    if (
      typeof productDoc.countInStock === "number" &&
      productDoc.countInStock < quantity
    ) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === product
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = productDoc.price;
    } else {
      cart.items.push({
        product,
        quantity,
        price: productDoc.price,
      });
    }

    await cart.save();

    res.status(201).json({
      message: "Product added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add to cart", error: error.message });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!cart) {
      return res.json([]);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedItems = cart.items.slice(startIndex, endIndex);

    res.json(paginatedItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get cart", error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: "All items removed from cart" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to clear cart", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = cart.items.id(id);
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const product = await Product.findById(cartItem.product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (
      typeof product.countInStock === "number" &&
      product.countInStock < quantity
    ) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    cartItem.quantity = quantity;
    cartItem.price = product.price;

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "name price image countInStock status description brand",
    });

    res.json({
      message: "Quantity updated",
      cart: populatedCart,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update quantity", error: error.message });
  }
};
