import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import {
  successResponse,
  errorResponse,
  validationError,
  notFoundError,
  paginatedResponse,
} from "../utils/response.js";

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
      return validationError(res, "You have already reviewed this product");
    }

    const product = await Product.findById(productId);
    if (!product) {
      return notFoundError(res, "Product not found");
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return validationError(res, "Rating must be between 1 and 5");
    }

    const review = new Review({
      userId,
      productId,
      rating,
      comment,
    });

    const savedReview = await review.save();

    // Update product ratings
    const avgRating = await Review.aggregate([
      { $match: { productId, isActive: true } },
      { $group: { _id: null, average: { $avg: "$rating" } } },
    ]);

    await Product.findByIdAndUpdate(productId, {
      ratings: avgRating[0]?.average || 0,
      numReviews: await Review.countDocuments({ productId, isActive: true }),
      $push: { reviews: savedReview._id },
    });

    return successResponse(
      res,
      savedReview,
      "Review created successfully",
      201
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({
      productId: req.params.productId,
      isActive: true,
    })
      .populate("userId", "name avatar")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({
      productId: req.params.productId,
      isActive: true,
    });

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
      limit,
    };

    return paginatedResponse(res, reviews, pagination);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getReviewsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ userId, isActive: true })
      .populate("productId", "name image")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ userId, isActive: true });

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
      limit,
    };

    return paginatedResponse(res, reviews, pagination);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return notFoundError(res, "Review not found");
    }

    if (review.userId.toString() !== userId && req.user.role !== "admin") {
      return validationError(res, "Not authorized to update this review");
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return validationError(res, "Rating must be between 1 and 5");
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true }
    );

    // Update product ratings
    const avgRating = await Review.aggregate([
      { $match: { productId: review.productId, isActive: true } },
      { $group: { _id: null, average: { $avg: "$rating" } } },
    ]);

    await Product.findByIdAndUpdate(review.productId, {
      ratings: avgRating[0]?.average || 0,
    });

    return successResponse(res, updatedReview, "Review updated successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return notFoundError(res, "Review not found");
    }

    if (review.userId.toString() !== userId && req.user.role !== "admin") {
      return validationError(res, "Not authorized to delete this review");
    }

    // Soft delete
    await Review.findByIdAndUpdate(req.params.id, { isActive: false });

    // Update product ratings
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

    return successResponse(res, null, "Review deleted successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("userId", "name avatar")
      .populate("productId", "name image");

    if (!review) {
      return notFoundError(res, "Review not found");
    }

    return successResponse(res, review);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ isActive: true })
      .populate("userId", "name email")
      .populate("productId", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ isActive: true });

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
      limit,
    };

    return paginatedResponse(res, reviews, pagination);
  } catch (error) {
    return errorResponse(res, error);
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

    return successResponse(res, {
      totalReviews,
      averageRating: averageRating[0]?.average || 0,
      ratingDistribution,
      recentReviews,
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};
