import { create } from "zustand";
import type { Order, CreateOrderRequest, UpdateOrderRequest } from "../types";
import { orderApi } from "../api";

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  totalOrders: number;
  currentPage: number;
  hasMore: boolean;
}

interface OrderActions {
  fetchOrders: (page?: number) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  createOrder: (data: CreateOrderRequest) => Promise<void>;
  updateOrder: (id: string, data: UpdateOrderRequest) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

type OrderStore = OrderState & OrderActions;

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  totalOrders: 0,
  currentPage: 1,
  hasMore: true,
};

export const useOrderStore = create<OrderStore>((set, get) => ({
  ...initialState,

  fetchOrders: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderApi.getAll();
      const orders = response.data || response;

      set({
        orders: page === 1 ? orders : [...get().orders, ...orders],
        totalOrders: orders.length,
        currentPage: page,
        hasMore: orders.length > 0,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to fetch orders",
      });
      throw error;
    }
  },

  fetchOrderById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderApi.getById(id);
      const order = response.data || response;

      set({
        currentOrder: order,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to fetch order",
      });
      throw error;
    }
  },

  createOrder: async (data: CreateOrderRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderApi.create(data);
      const newOrder = response.data || response;

      set({
        orders: [newOrder, ...get().orders],
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to create order",
      });
      throw error;
    }
  },

  updateOrder: async (id: string, data: UpdateOrderRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderApi.updateStatus(id, data);
      const updatedOrder = response.data || response;

      set({
        orders: get().orders.map((order) =>
          order._id === id ? updatedOrder : order
        ),
        currentOrder:
          get().currentOrder?._id === id ? updatedOrder : get().currentOrder,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to update order",
      });
      throw error;
    }
  },

  cancelOrder: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderApi.cancel(id);
      const updatedOrder = response.data || response;

      set({
        orders: get().orders.map((order) =>
          order._id === id ? updatedOrder : order
        ),
        currentOrder:
          get().currentOrder?._id === id ? updatedOrder : get().currentOrder,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to cancel order",
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
}));
