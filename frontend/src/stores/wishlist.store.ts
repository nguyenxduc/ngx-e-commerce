import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistItemWithProduct, AddToWishlistRequest } from "../types";
import { wishlistApi } from "../api";

interface WishlistState {
  items: WishlistItemWithProduct[];
  isLoading: boolean;
  error: string | null;
  totalItems: number;
}

interface WishlistActions {
  fetchWishlist: () => Promise<void>;
  addToWishlist: (data: AddToWishlistRequest) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  clearError: () => void;
  isInWishlist: (productId: string) => boolean;
}

type WishlistStore = WishlistState & WishlistActions;

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      isLoading: false,
      error: null,
      totalItems: 0,

      // Actions
      fetchWishlist: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await wishlistApi.getWishlist();
          const wishlist = response.data || response;
          const items = wishlist.items || [];

          set({
            items,
            totalItems: items.length,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || "Failed to fetch wishlist",
          });
          throw error;
        }
      },

      addToWishlist: async (data: AddToWishlistRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await wishlistApi.addToWishlist(data);
          const wishlist = response.data || response;
          const items = wishlist.items || [];

          set({
            items,
            totalItems: items.length,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || "Failed to add to wishlist",
          });
          throw error;
        }
      },

      removeFromWishlist: async (productId: string) => {
        set({ isLoading: true, error: null });
        try {
          await wishlistApi.removeFromWishlist(productId);

          const updatedItems = get().items.filter(
            (item) => item.product._id !== productId
          );

          set({
            items: updatedItems,
            totalItems: updatedItems.length,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error:
              error.response?.data?.error || "Failed to remove from wishlist",
          });
          throw error;
        }
      },

      clearWishlist: async () => {
        set({ isLoading: true, error: null });
        try {
          await wishlistApi.clearWishlist();

          set({
            items: [],
            totalItems: 0,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || "Failed to clear wishlist",
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.product._id === productId);
      },
    }),
    {
      name: "wishlist-storage",
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
      }),
    }
  )
);
