import axiosClient from "../lib/axios";
import type { CreateShopRequest, UpdateShopRequest } from "../types";

export const shopApi = {
  getAll: async () => {
    const response = await axiosClient.get("/shops");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosClient.get(`/shops/${id}`);
    return response.data;
  },

  getProducts: async (id: string) => {
    const response = await axiosClient.get(`/shops/${id}/products`);
    return response.data;
  },

  create: async (data: CreateShopRequest) => {
    const response = await axiosClient.post("/shops", data);
    return response.data;
  },

  update: async (id: string, data: UpdateShopRequest) => {
    const response = await axiosClient.put(`/shops/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosClient.delete(`/shops/${id}`);
    return response.data;
  },

  toggleFollow: async (id: string) => {
    const response = await axiosClient.post(`/shops/${id}/follow`);
    return response.data;
  },

  // Admin endpoints
  getAllAdmin: async () => {
    const response = await axiosClient.get("/shops/admin/all");
    return response.data;
  },

  getPending: async () => {
    const response = await axiosClient.get("/shops/admin/pending");
    return response.data;
  },

  approve: async (id: string) => {
    const response = await axiosClient.patch(`/shops/admin/${id}/approve`);
    return response.data;
  },

  reject: async (id: string) => {
    const response = await axiosClient.patch(`/shops/admin/${id}/reject`);
    return response.data;
  },

  suspend: async (id: string) => {
    const response = await axiosClient.patch(`/shops/admin/${id}/suspend`);
    return response.data;
  },

  reactivate: async (id: string) => {
    const response = await axiosClient.patch(`/shops/admin/${id}/reactivate`);
    return response.data;
  },
};
