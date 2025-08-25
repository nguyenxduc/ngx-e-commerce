import axiosClient from "../lib/axios";
import type {
  CreateCouponRequest,
  UpdateCouponRequest,
  ValidateCouponRequest,
} from "../types";

export const couponApi = {
  getAll: async () => {
    const response = await axiosClient.get("/coupons");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosClient.get(`/coupons/admin/${id}`);
    return response.data;
  },

  create: async (data: CreateCouponRequest) => {
    const response = await axiosClient.post("/coupons", data);
    return response.data;
  },

  update: async (id: string, data: UpdateCouponRequest) => {
    const response = await axiosClient.put(`/coupons/admin/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosClient.delete(`/coupons/admin/${id}`);
    return response.data;
  },

  validate: async (data: ValidateCouponRequest) => {
    const response = await axiosClient.post("/coupons/validate", data);
    return response.data;
  },
};
