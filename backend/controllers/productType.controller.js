import ProductType from "../models/productType.model.js";
import Product from "../models/product.model.js";
import {
  successResponse,
  errorResponse,
  validationError,
  notFoundError,
  paginatedResponse,
} from "../utils/response.js";

export const createProductType = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if product type with same name already exists
    const existingProductType = await ProductType.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      isActive: true,
    });
    if (existingProductType) {
      return validationError(res, "Product type with this name already exists");
    }

    const productType = new ProductType({
      name,
      description,
    });

    const savedProductType = await productType.save();
    return successResponse(
      res,
      savedProductType,
      "Product type created successfully",
      201
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getAllProductTypes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const productTypes = await ProductType.find({ isActive: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ProductType.countDocuments({ isActive: true });

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProductTypes: total,
      limit,
    };

    return paginatedResponse(res, productTypes, pagination);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getProductTypeById = async (req, res) => {
  try {
    const productType = await ProductType.findById(req.params.id);

    if (!productType) {
      return notFoundError(res, "Product type not found");
    }

    return successResponse(res, productType);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const updateProductType = async (req, res) => {
  try {
    const { name, description } = req.body;

    const productType = await ProductType.findById(req.params.id);
    if (!productType) {
      return notFoundError(res, "Product type not found");
    }

    // Check if name is being updated and if it conflicts with existing product type
    if (name && name !== productType.name) {
      const existingProductType = await ProductType.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        isActive: true,
        _id: { $ne: req.params.id },
      });
      if (existingProductType) {
        return validationError(
          res,
          "Product type with this name already exists"
        );
      }
    }

    const updatedProductType = await ProductType.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    return successResponse(
      res,
      updatedProductType,
      "Product type updated successfully"
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const deleteProductType = async (req, res) => {
  try {
    const productType = await ProductType.findById(req.params.id);
    if (!productType) {
      return notFoundError(res, "Product type not found");
    }

    // Check if there are any products using this product type
    const productsCount = await Product.countDocuments({
      category: req.params.id,
      isActive: true,
    });

    if (productsCount > 0) {
      return validationError(
        res,
        `Cannot delete product type. There are ${productsCount} active products using this type.`
      );
    }

    // Soft delete by setting isActive to false
    await ProductType.findByIdAndUpdate(req.params.id, { isActive: false });
    return successResponse(res, null, "Product type deleted successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getActiveProductTypes = async (req, res) => {
  try {
    const productTypes = await ProductType.find({ isActive: true })
      .select("name description")
      .sort({ name: 1 });

    return successResponse(res, productTypes);
  } catch (error) {
    return errorResponse(res, error);
  }
};
