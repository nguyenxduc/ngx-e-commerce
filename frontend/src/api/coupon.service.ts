import axiosClient from "../lib/axios";
import type {
  CreateCouponRequest,
  CreateCouponResponse,
  GetCouponResponse,
  ValidateCouponRequest,
  ValidateCouponResponse,
  GetAllCouponsRequest,
  GetAllCouponsResponse,
  GetCouponByIdResponse,
  UpdateCouponRequest,
  UpdateCouponResponse,
  DeleteCouponResponse,
  CouponStats,
  ApplyCouponRequest,
  ApplyCouponResponse,
  GetUserCouponsRequest,
  GetUserCouponsResponse,
} from "../types";

export const couponService = {
  // Public routes
  validateCoupon: async (
    data: ValidateCouponRequest
  ): Promise<ValidateCouponResponse> => {
    const response = await axiosClient.post("/coupons/validate", data);
    return response.data;
  },

  getCoupon: async (code: string): Promise<GetCouponResponse> => {
    const response = await axiosClient.get(`/coupons/${code}`);
    return response.data;
  },

  // Admin routes
  getAllCoupons: async (
    params?: GetAllCouponsRequest
  ): Promise<GetAllCouponsResponse> => {
    const response = await axiosClient.get("/coupons", { params });
    return response.data;
  },

  createCoupon: async (
    data: CreateCouponRequest
  ): Promise<CreateCouponResponse> => {
    const response = await axiosClient.post("/coupons", data);
    return response.data;
  },

  getCouponById: async (id: string): Promise<GetCouponByIdResponse> => {
    const response = await axiosClient.get(`/coupons/admin/${id}`);
    return response.data;
  },

  updateCoupon: async (
    id: string,
    data: UpdateCouponRequest
  ): Promise<UpdateCouponResponse> => {
    const response = await axiosClient.put(`/coupons/admin/${id}`, data);
    return response.data;
  },

  deleteCoupon: async (id: string): Promise<DeleteCouponResponse> => {
    const response = await axiosClient.delete(`/coupons/admin/${id}`);
    return response.data;
  },

  getCouponStats: async (): Promise<CouponStats> => {
    const response = await axiosClient.get("/coupons/stats");
    return response.data;
  },

  // User routes
  applyCoupon: async (
    data: ApplyCouponRequest
  ): Promise<ApplyCouponResponse> => {
    const response = await axiosClient.post("/coupons/apply", data);
    return response.data;
  },

  getUserCoupons: async (
    params?: GetUserCouponsRequest
  ): Promise<GetUserCouponsResponse> => {
    const response = await axiosClient.get("/coupons/user", { params });
    return response.data;
  },
};
