import axiosClient from "../lib/axios";
import type {
  CreateReviewRequest,
  CreateReviewResponse,
  UpdateReviewRequest,
  UpdateReviewResponse,
  GetReviewsRequest,
  GetReviewsResponse,
  GetReviewByIdResponse,
  DeleteReviewResponse,
} from "../types";

export const reviewService = {
  // Public routes
  getReviews: async (
    params?: GetReviewsRequest
  ): Promise<GetReviewsResponse> => {
    const response = await axiosClient.get("/reviews", { params });
    return response.data;
  },

  getReviewById: async (id: string): Promise<GetReviewByIdResponse> => {
    const response = await axiosClient.get(`/reviews/${id}`);
    return response.data;
  },

  // Protected routes
  createReview: async (
    data: CreateReviewRequest
  ): Promise<CreateReviewResponse> => {
    const response = await axiosClient.post("/reviews", data);
    return response.data;
  },

  updateReview: async (
    id: string,
    data: UpdateReviewRequest
  ): Promise<UpdateReviewResponse> => {
    const response = await axiosClient.put(`/reviews/${id}`, data);
    return response.data;
  },

  deleteReview: async (id: string): Promise<DeleteReviewResponse> => {
    const response = await axiosClient.delete(`/reviews/${id}`);
    return response.data;
  },
};
