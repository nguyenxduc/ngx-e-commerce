import axiosClient from "../lib/axios";
import type {
  AddToCartRequest,
  AddToCartResponse,
  GetCartProductsRequest,
  GetCartProductsResponse,
  RemoveAllFromCartResponse,
  UpdateQuantityRequest,
  UpdateQuantityResponse,
} from "../types";

export const cartService = {
  addToCart: async (data: AddToCartRequest): Promise<AddToCartResponse> => {
    const response = await axiosClient.post("/cart", data);
    return response.data;
  },

  getCartProducts: async (
    params?: GetCartProductsRequest
  ): Promise<GetCartProductsResponse> => {
    const response = await axiosClient.get("/cart", { params });
    return response.data;
  },

  removeAllFromCart: async (): Promise<RemoveAllFromCartResponse> => {
    const response = await axiosClient.delete("/cart");
    return response.data;
  },

  updateQuantity: async (
    id: string,
    data: UpdateQuantityRequest
  ): Promise<UpdateQuantityResponse> => {
    const response = await axiosClient.put(`/cart/${id}`, data);
    return response.data;
  },
};
