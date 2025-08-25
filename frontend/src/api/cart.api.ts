import axiosClient from "../lib/axios";
import type { AddToCartRequest, UpdateCartItemRequest } from "../types";

export const cartApi = {
  addToCart: async (data: AddToCartRequest) => {
    const response = await axiosClient.post("/cart", data);
    return response.data;
  },

  getCart: async () => {
    const response = await axiosClient.get("/cart");
    return response.data;
  },

  updateQuantity: async (id: string, data: UpdateCartItemRequest) => {
    const response = await axiosClient.put(`/cart/${id}`, data);
    return response.data;
  },

  removeItem: async (id: string) => {
    const response = await axiosClient.delete(`/cart/${id}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await axiosClient.delete("/cart");
    return response.data;
  },
};
