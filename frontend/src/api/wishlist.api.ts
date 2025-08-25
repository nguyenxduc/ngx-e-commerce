import axiosClient from "../lib/axios";
import type { AddToWishlistRequest } from "../types";

export const wishlistApi = {
  getWishlist: async () => {
    const response = await axiosClient.get("/wishlist");
    return response.data;
  },

  addToWishlist: async (data: AddToWishlistRequest) => {
    const response = await axiosClient.post("/wishlist", data);
    return response.data;
  },

  removeFromWishlist: async (productId: string) => {
    const response = await axiosClient.delete(`/wishlist/${productId}`);
    return response.data;
  },

  clearWishlist: async () => {
    const response = await axiosClient.delete("/wishlist");
    return response.data;
  },
};
