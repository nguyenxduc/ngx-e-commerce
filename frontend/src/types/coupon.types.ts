export interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  expirationDate: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCouponRequest {
  code: string;
  discountPercentage: number;
  expirationDate: Date;
  isActive?: boolean;
}

export interface CreateCouponResponse extends Coupon {}

export interface GetCouponRequest {
  code: string;
}

export interface GetCouponResponse extends Coupon {}

export interface ValidateCouponRequest {
  code: string;
  amount: number;
}

export interface ValidateCouponResponse {
  valid: boolean;
  coupon: Coupon;
  discount: number;
  finalAmount: number;
}

export interface GetAllCouponsRequest {
  page?: number;
  limit?: number;
}

export interface GetAllCouponsResponse {
  coupons: Coupon[];
  currentPage: number;
  totalPages: number;
  totalCoupons: number;
}

export interface GetCouponByIdRequest {
  id: string;
}

export interface GetCouponByIdResponse extends Coupon {}

export interface UpdateCouponRequest {
  code?: string;
  discountPercentage?: number;
  expirationDate?: Date;
  isActive?: boolean;
}

export interface UpdateCouponResponse extends Coupon {}

export interface DeleteCouponResponse {
  message: string;
}

export interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
}

export interface ApplyCouponRequest {
  code: string;
  amount: number;
}

export interface ApplyCouponResponse {
  success: boolean;
  coupon: Coupon;
  discount: number;
  finalAmount: number;
}

export interface GetUserCouponsRequest {
  page?: number;
  limit?: number;
}

export interface GetUserCouponsResponse {
  coupons: Coupon[];
  currentPage: number;
  totalPages: number;
  totalCoupons: number;
}

export interface CouponErrorResponse {
  error: string;
}
