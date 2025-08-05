import Review from "../models/review.model.js";
import Product from "../models/product.model.js";

// Tạo review mới
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;

    // Kiểm tra xem user đã review sản phẩm này chưa
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "Bạn đã đánh giá sản phẩm này rồi",
      });
    }

    // Tạo review mới
    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    // Cập nhật thống kê rating của sản phẩm
    const product = await Product.findById(productId);
    if (product) {
      const reviews = await Review.find({ product: productId });
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      await Product.findByIdAndUpdate(productId, {
        ratings: averageRating,
        numReviews: reviews.length,
      });
    }

    // Populate thông tin user
    await review.populate("user", "name");

    res.status(201).json(review);
  } catch (error) {
    console.log("Error in createReview controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả review của một sản phẩm
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ product: productId });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.log("Error in getProductReviews controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả review của user hiện tại
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ user: userId })
      .populate("product", "name image price")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ user: userId });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.log("Error in getUserReviews controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review không tồn tại" });
    }

    // Kiểm tra quyền (chỉ chủ review hoặc admin mới được sửa)
    if (review.user.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền sửa review này" });
    }

    // Cập nhật review
    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Cập nhật thống kê rating của sản phẩm
    const product = await Product.findById(review.product);
    if (product) {
      const reviews = await Review.find({ product: review.product });
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      await Product.findByIdAndUpdate(review.product, {
        ratings: averageRating,
        numReviews: reviews.length,
      });
    }

    await review.populate("user", "name");

    res.json(review);
  } catch (error) {
    console.log("Error in updateReview controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Xóa review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review không tồn tại" });
    }

    // Kiểm tra quyền (chỉ chủ review hoặc admin mới được xóa)
    if (review.user.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền xóa review này" });
    }

    const productId = review.product;

    // Xóa review
    await Review.findByIdAndDelete(id);

    // Cập nhật thống kê rating của sản phẩm
    const product = await Product.findById(productId);
    if (product) {
      const reviews = await Review.find({ product: productId });
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

      await Product.findByIdAndUpdate(productId, {
        ratings: averageRating,
        numReviews: reviews.length,
      });
    }

    res.json({ message: "Review đã được xóa thành công" });
  } catch (error) {
    console.log("Error in deleteReview controller", error.message);
    res.status(500).json({ message: error.message });
  }
}; 