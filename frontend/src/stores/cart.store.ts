import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
} from "../types";
import { cartApi } from "../api";

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  totalItems: number;
  totalAmount: number;
}

interface CartActions {
  fetchCart: () => Promise<void>;
  addToCart: (data: AddToCartRequest) => Promise<void>;
  updateQuantity: (id: string, data: UpdateCartItemRequest) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearError: () => void;
  calculateTotals: () => void;
}

type CartStore = CartState & CartActions;

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { totalItems, totalAmount };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      isLoading: false,
      error: null,
      totalItems: 0,
      totalAmount: 0,

      // Actions
      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await cartApi.getCart();
          const cart = response.data || response;
          const items = cart.items || [];
          const { totalItems, totalAmount } = calculateTotals(items);

          set({
            items,
            totalItems,
            totalAmount,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || "Failed to fetch cart",
          });
          throw error;
        }
      },

      addToCart: async (data: AddToCartRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await cartApi.addToCart(data);
          const cart = response.data || response;
          const items = cart.items || [];
          const { totalItems, totalAmount } = calculateTotals(items);

          set({
            items,
            totalItems,
            totalAmount,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || "Failed to add to cart",
          });
          throw error;
        }
      },

      updateQuantity: async (id: string, data: UpdateCartItemRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await cartApi.updateQuantity(id, data);
          const cart = response.data || response;
          const items = cart.items || [];
          const { totalItems, totalAmount } = calculateTotals(items);

          set({
            items,
            totalItems,
            totalAmount,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || "Failed to update quantity",
          });
          throw error;
        }
      },

      removeItem: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await cartApi.removeItem(id);

          const updatedItems = get().items.filter(
            (item) => item.product !== id
          );
          const { totalItems, totalAmount } = calculateTotals(updatedItems);

          set({
            items: updatedItems,
            totalItems,
            totalAmount,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || "Failed to remove item",
          });
          throw error;
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
          await cartApi.clearCart();

          set({
            items: [],
            totalItems: 0,
            totalAmount: 0,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || "Failed to clear cart",
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      calculateTotals: () => {
        const { items } = get();
        const { totalItems, totalAmount } = calculateTotals(items);
        set({ totalItems, totalAmount });
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalAmount: state.totalAmount,
      }),
    }
  )
);
