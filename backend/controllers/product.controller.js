import Product from "../models/product.model.js";
import ProductType from "../models/productType.model.js";
import cloudinary from "../lib/cloudinary.js";
import {
  successResponse,
  errorResponse,
  validationError,
  notFoundError,
  paginatedResponse,
} from "../utils/response.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, shop, countInStock, image } =
      req.body;

    // Check for duplicate product (name, category, shop combination)
    const existingProduct = await Product.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      category,
      shop,
      isActive: true,
    });

    if (existingProduct) {
      return validationError(
        res,
        "Product with this name and category already exists in your shop"
      );
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      shop,
      countInStock,
      image,
    });

    const savedProduct = await product.save();
    return successResponse(
      res,
      savedProduct,
      "Product created successfully",
      201
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ isActive: true })
      .populate("category", "name")
      .populate("shop", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({ isActive: true });

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      limit,
    };

    return paginatedResponse(res, products, pagination);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("shop", "name");

    if (!product) {
      return notFoundError(res, "Product not found");
    }

    return successResponse(res, product);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, countInStock, image } =
      req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return notFoundError(res, "Product not found");
    }

    // Check for duplicate product when updating name or category
    if (name || category) {
      const existingProduct = await Product.findOne({
        name: { $regex: new RegExp(`^${name || product.name}$`, "i") },
        category: category || product.category,
        shop: product.shop,
        isActive: true,
        _id: { $ne: req.params.id },
      });

      if (existingProduct) {
        return validationError(
          res,
          "Product with this name and category already exists in your shop"
        );
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        countInStock,
        image,
      },
      { new: true }
    );

    return successResponse(res, updatedProduct, "Product updated successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return notFoundError(res, "Product not found");
    }

    // Check if product has active orders
    const Order = (await import("../models/order.model.js")).default;
    const activeOrders = await Order.countDocuments({
      "items.product": req.params.id,
      status: { $in: ["pending", "processing", "shipped"] },
    });

    if (activeOrders > 0) {
      return validationError(
        res,
        `Cannot delete product. There are ${activeOrders} active orders containing this product.`
      );
    }

    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    return successResponse(res, null, "Product deleted successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { isActive: true };

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "name_asc") sortOption = { name: 1 };

    const products = await Product.find(query)
      .populate("category", "name")
      .populate("shop", "name")
      .skip(skip)
      .limit(limit)
      .sort(sortOption);

    const total = await Product.countDocuments(query);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      limit,
    };

    return paginatedResponse(res, products, pagination);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({
      category: req.params.categoryId,
      isActive: true,
    })
      .populate("category", "name")
      .populate("shop", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({
      category: req.params.categoryId,
      isActive: true,
    });

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      limit,
    };

    return paginatedResponse(res, products, pagination);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getProductsByShop = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({
      shop: req.params.shopId,
      isActive: true,
    })
      .populate("category", "name")
      .populate("shop", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({
      shop: req.params.shopId,
      isActive: true,
    });

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      limit,
    };

    return paginatedResponse(res, products, pagination);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const uploadProductImages = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return notFoundError(res, "Product not found");
    }

    if (!req.file) {
      return validationError(res, "No image file provided");
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
      width: 500,
      crop: "scale",
    });

    product.image = result.secure_url;
    await product.save();

    return successResponse(res, product, "Image uploaded successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return notFoundError(res, "Product not found");
    }

    // Reset to default image or remove image
    product.image = "";
    await product.save();

    return successResponse(res, product, "Image deleted successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};
