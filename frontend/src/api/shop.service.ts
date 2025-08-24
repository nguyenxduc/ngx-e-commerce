import axiosClient from "../lib/axios";
import type {
  CreateShopRequest,
  CreateShopResponse,
  UpdateShopRequest,
  UpdateShopResponse,
  GetShopsRequest,
  GetShopsResponse,
  GetPendingShopsRequest,
  GetPendingShopsResponse,
  ApproveShopResponse,
  RejectShopResponse,
  SuspendShopResponse,
  ReactivateShopResponse,
  GetShopByIdResponse,
  GetShopProductsRequest,
  GetShopProductsResponse,
  ToggleFollowShopResponse,
  DeleteShopResponse,
} from "../types";

export const shopService = {
  // Public routes
  getAllShops: async (params?: GetShopsRequest): Promise<GetShopsResponse> => {
    const response = await axiosClient.get("/shops", { params });
    return response.data;
  },

  getShopById: async (id: string): Promise<GetShopByIdResponse> => {
    const response = await axiosClient.get(`/shops/${id}`);
    return response.data;
  },

  getShopProducts: async (
    id: string,
    params?: Omit<GetShopProductsRequest, "id">
  ): Promise<GetShopProductsResponse> => {
    const response = await axiosClient.get(`/shops/${id}/products`, { params });
    return response.data;
  },

  // Protected routes
  createShop: async (data: CreateShopRequest): Promise<CreateShopResponse> => {
    const response = await axiosClient.post("/shops", data);
    return response.data;
  },

  updateShop: async (
    id: string,
    data: UpdateShopRequest
  ): Promise<UpdateShopResponse> => {
    const response = await axiosClient.put(`/shops/${id}`, data);
    return response.data;
  },

  deleteShop: async (id: string): Promise<DeleteShopResponse> => {
    const response = await axiosClient.delete(`/shops/${id}`);
    return response.data;
  },

  toggleFollowShop: async (id: string): Promise<ToggleFollowShopResponse> => {
    const response = await axiosClient.post(`/shops/${id}/follow`);
    return response.data;
  },

  // Admin routes
  getPendingShops: async (
    params?: GetPendingShopsRequest
  ): Promise<GetPendingShopsResponse> => {
    const response = await axiosClient.get("/shops/admin/pending", { params });
    return response.data;
  },

  approveShop: async (id: string): Promise<ApproveShopResponse> => {
    const response = await axiosClient.patch(`/shops/admin/${id}/approve`);
    return response.data;
  },

  rejectShop: async (
    id: string,
    reason: string
  ): Promise<RejectShopResponse> => {
    const response = await axiosClient.patch(`/shops/admin/${id}/reject`, {
      reason,
    });
    return response.data;
  },

  suspendShop: async (
    id: string,
    reason: string
  ): Promise<SuspendShopResponse> => {
    const response = await axiosClient.patch(`/shops/admin/${id}/suspend`, {
      reason,
    });
    return response.data;
  },

  reactivateShop: async (id: string): Promise<ReactivateShopResponse> => {
    const response = await axiosClient.patch(`/shops/admin/${id}/reactivate`);
    return response.data;
  },
};
