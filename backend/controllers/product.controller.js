import redis from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import ProductType from "../models/productType.model.js";
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, brand, minPrice, maxPrice, sort } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by brand
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Sort options
    let sortOption = {};
    if (sort === 'price_asc') sortOption.price = 1;
    else if (sort === 'price_desc') sortOption.price = -1;
    else if (sort === 'newest') sortOption.createdAt = -1;
    else if (sort === 'rating') sortOption.ratings = -1;
    else sortOption.createdAt = -1;
    
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");

    if (featuredProducts) return res.json(JSON.parse(featuredProducts));

    // Lấy sản phẩm nổi bật
    featuredProducts = await Product.find({ isFeatured: true })
      .populate('category', 'name')
      .lean();

    if (!featuredProducts || featuredProducts.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm nổi bật" });
    }

    await redis.set("featured_products", JSON.stringify(featuredProducts));

    return res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, category, description, isFeatured, image } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      price,
      category,
      description,
      brand: req.body.brand || "Unknown",
      countInStock: req.body.countInStock || 0,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : null,
      seller: req.user.role === "seller" ? req.user._id : req.body.seller || req.user._id,
    });

    await product.populate('seller', 'name email');
    await product.populate('category', 'name');

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Kiểm tra quyền: chỉ admin hoặc seller sở hữu sản phẩm mới được xóa
    if (req.user.role !== "admin" && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied - You can only delete your own products" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("deleted image from cloudinary");
      } catch (error) {
        console.log("error deleting image from cloudinary", error);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // Thay đổi logic để toggle trạng thái nổi bật
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Lấy sản phẩm theo ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name description')
      .populate('reviews', 'rating comment user createdAt')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name'
        }
      });

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    res.json(product);
  } catch (error) {
    console.log("Error in getProductById controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Kiểm tra quyền: chỉ admin hoặc seller sở hữu sản phẩm mới được cập nhật
    if (req.user.role !== "admin" && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied - You can only update your own products" });
    }

    // Xử lý upload ảnh nếu có
    if (updateData.image && updateData.image.startsWith('data:')) {
      const cloudinaryResponse = await cloudinary.uploader.upload(updateData.image, {
        folder: "products",
      });
      updateData.image = cloudinaryResponse.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name').populate('seller', 'name email');

    res.json(updatedProduct);
  } catch (error) {
    console.log("Error in updateProduct controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Lấy sản phẩm của seller
export const getSellerProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const sellerId = req.user._id;

    let query = { seller: sellerId };
    
    // Filter theo trạng thái tồn kho
    if (status === "inStock") {
      query.countInStock = { $gt: 0 };
    } else if (status === "outOfStock") {
      query.countInStock = 0;
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.log("Error in getSellerProducts controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Thống kê sản phẩm của seller
export const getSellerStats = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Tổng sản phẩm
    const totalProducts = await Product.countDocuments({ seller: sellerId });
    const inStockProducts = await Product.countDocuments({ 
      seller: sellerId, 
      countInStock: { $gt: 0 } 
    });
    const outOfStockProducts = await Product.countDocuments({ 
      seller: sellerId, 
      countInStock: 0 
    });

    // Sản phẩm được tạo trong tháng/năm
    const productsThisMonth = await Product.countDocuments({
      seller: sellerId,
      createdAt: { $gte: startOfMonth },
    });
    const productsThisYear = await Product.countDocuments({
      seller: sellerId,
      createdAt: { $gte: startOfYear },
    });

    // Tổng giá trị tồn kho
    const inventoryValue = await Product.aggregate([
      { $match: { seller: sellerId } },
      { $group: { _id: null, total: { $sum: { $multiply: ["$price", "$countInStock"] } } } },
    ]);

    res.json({
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      productsThisMonth,
      productsThisYear,
      inventoryValue: inventoryValue[0]?.total || 0,
    });
  } catch (error) {
    console.log("Error in getSellerStats controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in update cache function");
  }
}
