import axiosClient from "../lib/axios";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrdersRequest,
  GetOrdersResponse,
  GetOrderByIdResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  DeleteOrderResponse,
} from "../types";

export const orderService = {
  // Protected routes
  createOrder: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await axiosClient.post("/orders", data);
    return response.data;
  },

  getOrders: async (params?: GetOrdersRequest): Promise<GetOrdersResponse> => {
    const response = await axiosClient.get("/orders", { params });
    return response.data;
  },

  getOrderById: async (id: string): Promise<GetOrderByIdResponse> => {
    const response = await axiosClient.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, data: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> => {
    const response = await axiosClient.put(`/orders/${id}/status`, data);
    return response.data;
  },

  deleteOrder: async (id: string): Promise<DeleteOrderResponse> => {
    const response = await axiosClient.delete(`/orders/${id}`);
    return response.data;
  },
};
