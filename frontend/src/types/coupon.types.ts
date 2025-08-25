import type { BaseEntity } from "./common.types";

export type Coupon = BaseEntity & {
  code: string;
  discountPercentage: number;
  expirationDate: string;
  isActive: boolean;
};

export type CreateCouponRequest = {
  code: string;
  discountPercentage: number;
  expirationDate: string;
};

export type UpdateCouponRequest = {
  discountPercentage?: number;
  expirationDate?: string;
  isActive?: boolean;
};

export type ValidateCouponRequest = {
  code: string;
  amount: number;
};

export type ValidateCouponResponse = {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  message?: string;
};

export type CouponFilters = {
  isActive?: boolean;
  search?: string;
  sortBy?: "createdAt" | "discountValue" | "usageLimit";
  sortOrder?: "asc" | "desc";
};
