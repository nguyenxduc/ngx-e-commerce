import Review from "../models/review.model.js";
import Product from "../models/product.model.js";

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    const existingReview = await Review.findOne({
      userId,
      productId,
      isActive: true,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const review = new Review({
      userId,
      productId,
      rating,
      comment,
    });

    const savedReview = await review.save();

    const avgRating = await Review.aggregate([
      { $match: { productId, isActive: true } },
      { $group: { _id: null, average: { $avg: "$rating" } } },
    ]);

    await Product.findByIdAndUpdate(productId, {
      ratings: avgRating[0]?.average || 0,
      numReviews: await Review.countDocuments({ productId, isActive: true }),
      $push: { reviews: savedReview._id },
    });

    res.status(201).json({
      message: "Review created successfully",
      review: savedReview,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create review", error: error.message });
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
      isActive: true,
    })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get reviews", error: error.message });
  }
};

export const getReviewsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const reviews = await Review.find({ userId, isActive: true })
      .populate("productId", "name image")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get user reviews", error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(req.params.id);
    if (!review || !review.isActive) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true }
    );

    const avgRating = await Review.aggregate([
      { $match: { productId: review.productId, isActive: true } },
      { $group: { _id: null, average: { $avg: "$rating" } } },
    ]);

    await Product.findByIdAndUpdate(review.productId, {
      ratings: avgRating[0]?.average || 0,
    });

    res.json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update review", error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;

    const review = await Review.findById(req.params.id);
    if (!review || !review.isActive) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    await Review.findByIdAndUpdate(req.params.id, { isActive: false });

    const avgRating = await Review.aggregate([
      { $match: { productId: review.productId, isActive: true } },
      { $group: { _id: null, average: { $avg: "$rating" } } },
    ]);

    await Product.findByIdAndUpdate(review.productId, {
      ratings: avgRating[0]?.average || 0,
      numReviews: await Review.countDocuments({
        productId: review.productId,
        isActive: true,
      }),
      $pull: { reviews: review._id },
    });

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete review", error: error.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("userId", "name avatar")
      .populate("productId", "name image");

    if (!review || !review.isActive) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get review", error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isActive: true })
      .populate("userId", "name email")
      .populate("productId", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get all reviews", error: error.message });
  }
};

export const getProductReviewStats = async (req, res) => {
  try {
    const { productId } = req.params;

    const [totalReviews, averageRating, ratingDistribution, recentReviews] =
      await Promise.all([
        Review.countDocuments({ productId, isActive: true }),
        Review.aggregate([
          { $match: { productId, isActive: true } },
          { $group: { _id: null, average: { $avg: "$rating" } } },
        ]),
        Review.aggregate([
          { $match: { productId, isActive: true } },
          { $group: { _id: "$rating", count: { $sum: 1 } } },
          { $sort: { _id: -1 } },
        ]),
        Review.find({ productId, isActive: true })
          .populate("userId", "name avatar")
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    res.json({
      totalReviews,
      averageRating: averageRating[0]?.average || 0,
      ratingDistribution,
      recentReviews,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get review stats", error: error.message });
  }
};
