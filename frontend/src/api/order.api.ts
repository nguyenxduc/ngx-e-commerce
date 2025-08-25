import axiosClient from "../lib/axios";
import type { CreateOrderRequest, UpdateOrderStatusRequest } from "../types";

export const orderApi = {
  getAll: async () => {
    const response = await axiosClient.get("/orders");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosClient.get(`/orders/${id}`);
    return response.data;
  },

  create: async (data: CreateOrderRequest) => {
    const response = await axiosClient.post("/orders", data);
    return response.data;
  },

  updateStatus: async (id: string, data: UpdateOrderStatusRequest) => {
    const response = await axiosClient.put(`/orders/${id}/status`, data);
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await axiosClient.put(`/orders/${id}/cancel`);
    return response.data;
  },
};
