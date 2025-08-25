import { create } from "zustand";
import type { Shop, CreateShopRequest, UpdateShopRequest } from "../types";
import { shopApi } from "../api";

interface ShopState {
  shops: Shop[];
  currentShop: Shop | null;
  isLoading: boolean;
  error: string | null;
  totalShops: number;
  currentPage: number;
  hasMore: boolean;
}

interface ShopActions {
  fetchShops: (page?: number) => Promise<void>;
  fetchShopById: (id: string) => Promise<void>;
  createShop: (data: CreateShopRequest) => Promise<void>;
  updateShop: (id: string, data: UpdateShopRequest) => Promise<void>;
  deleteShop: (id: string) => Promise<void>;
  approveShop: (id: string) => Promise<void>;
  rejectShop: (id: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

type ShopStore = ShopState & ShopActions;

const initialState: ShopState = {
  shops: [],
  currentShop: null,
  isLoading: false,
  error: null,
  totalShops: 0,
  currentPage: 1,
  hasMore: true,
};

export const useShopStore = create<ShopStore>((set, get) => ({
  ...initialState,

  fetchShops: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await shopApi.getAll();
      const shops = response.data || response;

      set({
        shops: page === 1 ? shops : [...get().shops, ...shops],
        totalShops: shops.length,
        currentPage: page,
        hasMore: shops.length > 0,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to fetch shops",
      });
      throw error;
    }
  },

  fetchShopById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await shopApi.getById(id);
      const shop = response.data || response;

      set({
        currentShop: shop,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to fetch shop",
      });
      throw error;
    }
  },

  createShop: async (data: CreateShopRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await shopApi.create(data);
      const newShop = response.data || response;

      set({
        shops: [newShop, ...get().shops],
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to create shop",
      });
      throw error;
    }
  },

  updateShop: async (id: string, data: UpdateShopRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await shopApi.update(id, data);
      const updatedShop = response.data || response;

      set({
        shops: get().shops.map((shop) =>
          shop._id === id ? updatedShop : shop
        ),
        currentShop:
          get().currentShop?._id === id ? updatedShop : get().currentShop,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to update shop",
      });
      throw error;
    }
  },

  deleteShop: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await shopApi.delete(id);

      set({
        shops: get().shops.filter((shop) => shop._id !== id),
        currentShop: get().currentShop?._id === id ? null : get().currentShop,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to delete shop",
      });
      throw error;
    }
  },

  approveShop: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await shopApi.approve(id);
      const updatedShop = response.data || response;

      set({
        shops: get().shops.map((shop) =>
          shop._id === id ? updatedShop : shop
        ),
        currentShop:
          get().currentShop?._id === id ? updatedShop : get().currentShop,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to approve shop",
      });
      throw error;
    }
  },

  rejectShop: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await shopApi.reject(id);
      const updatedShop = response.data || response;

      set({
        shops: get().shops.map((shop) =>
          shop._id === id ? updatedShop : shop
        ),
        currentShop:
          get().currentShop?._id === id ? updatedShop : get().currentShop,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to reject shop",
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
