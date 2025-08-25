import { create } from "zustand";
import type {
  Product,
  ProductFilters,
  CreateProductRequest,
  UpdateProductRequest,
} from "../types";
import { productApi } from "../api";

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
  totalProducts: number;
  currentPage: number;
  hasMore: boolean;
}

interface ProductActions {
  fetchProducts: (page?: number) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  getProductsByCategory: (categoryId: string) => Promise<void>;
  getProductsByShop: (shopId: string) => Promise<void>;
  createProduct: (data: CreateProductRequest) => Promise<void>;
  updateProduct: (id: string, data: UpdateProductRequest) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setFilters: (filters: ProductFilters) => void;
  clearFilters: () => void;
  clearError: () => void;
  reset: () => void;
}

type ProductStore = ProductState & ProductActions;

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  filters: {},
  totalProducts: 0,
  currentPage: 1,
  hasMore: true,
};

export const useProductStore = create<ProductStore>((set, get) => ({
  ...initialState,

  fetchProducts: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productApi.getAll();
      const products = response.data || response;

      set({
        products: page === 1 ? products : [...get().products, ...products],
        totalProducts: products.length,
        currentPage: page,
        hasMore: products.length > 0,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to fetch products",
      });
      throw error;
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productApi.getById(id);
      const product = response.data || response;

      set({
        currentProduct: product,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to fetch product",
      });
      throw error;
    }
  },

  searchProducts: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productApi.search(query);
      const products = response.data || response;

      set({
        products,
        totalProducts: products.length,
        currentPage: 1,
        hasMore: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to search products",
      });
      throw error;
    }
  },

  getProductsByCategory: async (categoryId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productApi.getByCategory(categoryId);
      const products = response.data || response;

      set({
        products,
        totalProducts: products.length,
        currentPage: 1,
        hasMore: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.error || "Failed to fetch products by category",
      });
      throw error;
    }
  },

  getProductsByShop: async (shopId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productApi.getByShop(shopId);
      const products = response.data || response;

      set({
        products,
        totalProducts: products.length,
        currentPage: 1,
        hasMore: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.error || "Failed to fetch products by shop",
      });
      throw error;
    }
  },

  createProduct: async (data: CreateProductRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productApi.create(data);
      const newProduct = response.data || response;

      set({
        products: [newProduct, ...get().products],
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to create product",
      });
      throw error;
    }
  },

  updateProduct: async (id: string, data: UpdateProductRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productApi.update(id, data);
      const updatedProduct = response.data || response;

      set({
        products: get().products.map((product) =>
          product._id === id ? updatedProduct : product
        ),
        currentProduct:
          get().currentProduct?._id === id
            ? updatedProduct
            : get().currentProduct,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to update product",
      });
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await productApi.delete(id);

      set({
        products: get().products.filter((product) => product._id !== id),
        currentProduct:
          get().currentProduct?._id === id ? null : get().currentProduct,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to delete product",
      });
      throw error;
    }
  },

  setFilters: (filters: ProductFilters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
}));
