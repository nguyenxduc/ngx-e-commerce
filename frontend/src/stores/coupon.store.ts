import { create } from "zustand";
import type {
  Coupon,
  CreateCouponRequest,
  UpdateCouponRequest,
  ValidateCouponRequest,
} from "../types";
import { couponApi } from "../api";

interface CouponState {
  coupons: Coupon[];
  currentCoupon: Coupon | null;
  isLoading: boolean;
  error: string | null;
  totalCoupons: number;
  currentPage: number;
  hasMore: boolean;
}

interface CouponActions {
  fetchCoupons: (page?: number) => Promise<void>;
  fetchCouponById: (id: string) => Promise<void>;
  createCoupon: (data: CreateCouponRequest) => Promise<void>;
  updateCoupon: (id: string, data: UpdateCouponRequest) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  validateCoupon: (data: ValidateCouponRequest) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

type CouponStore = CouponState & CouponActions;

const initialState: CouponState = {
  coupons: [],
  currentCoupon: null,
  isLoading: false,
  error: null,
  totalCoupons: 0,
  currentPage: 1,
  hasMore: true,
};

export const useCouponStore = create<CouponStore>((set, get) => ({
  ...initialState,

  fetchCoupons: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await couponApi.getAll();
      const coupons = response.data || response;

      set({
        coupons: page === 1 ? coupons : [...get().coupons, ...coupons],
        totalCoupons: coupons.length,
        currentPage: page,
        hasMore: coupons.length > 0,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to fetch coupons",
      });
      throw error;
    }
  },

  fetchCouponById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await couponApi.getById(id);
      const coupon = response.data || response;

      set({
        currentCoupon: coupon,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to fetch coupon",
      });
      throw error;
    }
  },

  createCoupon: async (data: CreateCouponRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await couponApi.create(data);
      const newCoupon = response.data || response;

      set({
        coupons: [newCoupon, ...get().coupons],
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to create coupon",
      });
      throw error;
    }
  },

  updateCoupon: async (id: string, data: UpdateCouponRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await couponApi.update(id, data);
      const updatedCoupon = response.data || response;

      set({
        coupons: get().coupons.map((coupon) =>
          coupon._id === id ? updatedCoupon : coupon
        ),
        currentCoupon:
          get().currentCoupon?._id === id ? updatedCoupon : get().currentCoupon,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to update coupon",
      });
      throw error;
    }
  },

  deleteCoupon: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await couponApi.delete(id);

      set({
        coupons: get().coupons.filter((coupon) => coupon._id !== id),
        currentCoupon:
          get().currentCoupon?._id === id ? null : get().currentCoupon,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to delete coupon",
      });
      throw error;
    }
  },

  validateCoupon: async (data: ValidateCouponRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await couponApi.validate(data);
      const coupon = response.data || response;

      set({
        currentCoupon: coupon,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to validate coupon",
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
