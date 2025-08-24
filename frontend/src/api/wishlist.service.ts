import axiosClient from "../lib/axios";
import type {
  AddToWishlistRequest,
  AddToWishlistResponse,
  RemoveFromWishlistResponse,
  GetWishlistRequest,
  GetWishlistResponse,
  ClearWishlistResponse,
} from "../types";

export const wishlistService = {
  // Protected routes
  addToWishlist: async (
    data: AddToWishlistRequest
  ): Promise<AddToWishlistResponse> => {
    const response = await axiosClient.post("/wishlist", data);
    return response.data;
  },

  removeFromWishlist: async (
    productId: string
  ): Promise<RemoveFromWishlistResponse> => {
    const response = await axiosClient.delete(`/wishlist/${productId}`);
    return response.data;
  },

  getWishlist: async (
    params?: GetWishlistRequest
  ): Promise<GetWishlistResponse> => {
    const response = await axiosClient.get("/wishlist", { params });
    return response.data;
  },

  clearWishlist: async (): Promise<ClearWishlistResponse> => {
    const response = await axiosClient.delete("/wishlist");
    return response.data;
  },
};
