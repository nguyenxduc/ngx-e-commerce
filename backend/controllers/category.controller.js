import ProductType from "../models/productType.model.js";
import Product from "../models/product.model.js";

// Lấy tất cả danh mục
export const getAllCategories = async (req, res) => {
  try {
    const categories = await ProductType.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.log("Error in getAllCategories controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh mục theo ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await ProductType.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }

    // Lấy số lượng sản phẩm trong danh mục
    const productCount = await Product.countDocuments({ category: req.params.id });

    res.json({
      ...category.toObject(),
      productCount,
    });
  } catch (error) {
    console.log("Error in getCategoryById controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Tạo danh mục mới
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Kiểm tra danh mục đã tồn tại
    const existingCategory = await ProductType.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Danh mục đã tồn tại" });
    }

    const category = await ProductType.create({
      name,
      description,
    });

    res.status(201).json(category);
  } catch (error) {
    console.log("Error in createCategory controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật danh mục
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await ProductType.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }

    // Kiểm tra tên danh mục đã tồn tại (trừ danh mục hiện tại)
    if (name && name !== category.name) {
      const existingCategory = await ProductType.findOne({ name, _id: { $ne: id } });
      if (existingCategory) {
        return res.status(400).json({ message: "Tên danh mục đã tồn tại" });
      }
    }

    const updatedCategory = await ProductType.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    res.json(updatedCategory);
  } catch (error) {
    console.log("Error in updateCategory controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Xóa danh mục
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ProductType.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tồn tại" });
    }

    // Kiểm tra xem có sản phẩm nào trong danh mục không
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return res.status(400).json({ 
        message: `Không thể xóa danh mục. Có ${productCount} sản phẩm trong danh mục này.` 
      });
    }

    await ProductType.findByIdAndDelete(id);

    res.json({ message: "Danh mục đã được xóa thành công" });
  } catch (error) {
    console.log("Error in deleteCategory controller", error.message);
    res.status(500).json({ message: error.message });
  }
}; 