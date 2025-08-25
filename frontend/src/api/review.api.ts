import axiosClient from "../lib/axios";
import type { CreateReviewRequest, UpdateReviewRequest } from "../types";

export const reviewApi = {
  getAll: async () => {
    const response = await axiosClient.get("/reviews");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosClient.get(`/reviews/${id}`);
    return response.data;
  },

  getByProduct: async (productId: string) => {
    const response = await axiosClient.get(`/reviews/product/${productId}`);
    return response.data;
  },

  create: async (data: CreateReviewRequest) => {
    const response = await axiosClient.post("/reviews", data);
    return response.data;
  },

  update: async (id: string, data: UpdateReviewRequest) => {
    const response = await axiosClient.put(`/reviews/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosClient.delete(`/reviews/${id}`);
    return response.data;
  },
};
