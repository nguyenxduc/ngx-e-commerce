import { create } from "zustand";
import type {
  Review,
  CreateReviewRequest,
  UpdateReviewRequest,
} from "../types";
import { reviewApi } from "../api";

interface ReviewState {
  reviews: Review[];
  currentReview: Review | null;
  isLoading: boolean;
  error: string | null;
  totalReviews: number;
  currentPage: number;
  hasMore: boolean;
}

interface ReviewActions {
  fetchReviews: (productId: string, page?: number) => Promise<void>;
  fetchReviewById: (id: string) => Promise<void>;
  createReview: (data: CreateReviewRequest) => Promise<void>;
  updateReview: (id: string, data: UpdateReviewRequest) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

type ReviewStore = ReviewState & ReviewActions;

const initialState: ReviewState = {
  reviews: [],
  currentReview: null,
  isLoading: false,
  error: null,
  totalReviews: 0,
  currentPage: 1,
  hasMore: true,
};

export const useReviewStore = create<ReviewStore>((set, get) => ({
  ...initialState,

  fetchReviews: async (productId: string, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewApi.getByProduct(productId);
      const reviews = response.data || response;

      set({
        reviews: page === 1 ? reviews : [...get().reviews, ...reviews],
        totalReviews: reviews.length,
        currentPage: page,
        hasMore: reviews.length > 0,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to fetch reviews",
      });
      throw error;
    }
  },

  fetchReviewById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewApi.getById(id);
      const review = response.data || response;

      set({
        currentReview: review,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to fetch review",
      });
      throw error;
    }
  },

  createReview: async (data: CreateReviewRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewApi.create(data);
      const newReview = response.data || response;

      set({
        reviews: [newReview, ...get().reviews],
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to create review",
      });
      throw error;
    }
  },

  updateReview: async (id: string, data: UpdateReviewRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await reviewApi.update(id, data);
      const updatedReview = response.data || response;

      set({
        reviews: get().reviews.map((review) =>
          review._id === id ? updatedReview : review
        ),
        currentReview:
          get().currentReview?._id === id ? updatedReview : get().currentReview,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to update review",
      });
      throw error;
    }
  },

  deleteReview: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await reviewApi.delete(id);

      set({
        reviews: get().reviews.filter((review) => review._id !== id),
        currentReview:
          get().currentReview?._id === id ? null : get().currentReview,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to delete review",
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
}));
