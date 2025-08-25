import ProductType from "../models/productType.model.js";
import Product from "../models/product.model.js";

export const createProductType = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingProductType = await ProductType.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      isActive: true,
    });
    if (existingProductType) {
      return res
        .status(400)
        .json({ message: "Product type with this name already exists" });
    }

    const productType = new ProductType({
      name,
      description,
    });

    const savedProductType = await productType.save();
    res.status(201).json({
      message: "Product type created successfully",
      productType: savedProductType,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create product type", error: error.message });
  }
};

export const getAllProductTypes = async (req, res) => {
  try {
    const productTypes = await ProductType.find({ isActive: true });
    res.json(productTypes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get product types", error: error.message });
  }
};

export const getProductTypeById = async (req, res) => {
  try {
    const productType = await ProductType.findById(req.params.id);

    if (!productType || !productType.isActive) {
      return res.status(404).json({ message: "Product type not found" });
    }

    res.json(productType);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get product type", error: error.message });
  }
};

export const updateProductType = async (req, res) => {
  try {
    const { name, description } = req.body;

    const productType = await ProductType.findById(req.params.id);
    if (!productType || !productType.isActive) {
      return res.status(404).json({ message: "Product type not found" });
    }

    if (name && name !== productType.name) {
      const existingProductType = await ProductType.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        isActive: true,
        _id: { $ne: req.params.id },
      });
      if (existingProductType) {
        return res
          .status(400)
          .json({ message: "Product type with this name already exists" });
      }
    }

    const updatedProductType = await ProductType.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    res.json({
      message: "Product type updated successfully",
      productType: updatedProductType,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update product type", error: error.message });
  }
};

export const deleteProductType = async (req, res) => {
  try {
    const productType = await ProductType.findById(req.params.id);
    if (!productType) {
      return res.status(404).json({ message: "Product type not found" });
    }

    await ProductType.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: "Product type deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete product type", error: error.message });
  }
};

export const getActiveProductTypes = async (req, res) => {
  try {
    const productTypes = await ProductType.find({ isActive: true })
      .select("name description")
      .sort({ name: 1 });

    res.json(productTypes);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to get active product types",
        error: error.message,
      });
  }
};
