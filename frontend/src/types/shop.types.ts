export interface Shop {
  _id: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  address?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  businessInfo?: {
    type?: string;
    registrationNumber?: string;
  };
  ownerId: string;
  owner?: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  totalRatings: number;
  followers: number;
  isActive: boolean;
  status?: "pending" | "approved" | "rejected" | "suspended";
  approvedAt?: Date;
  rejectionReason?: string;
  suspensionReason?: string;
  productCount?: number;
  followerCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateShopRequest {
  name: string;
  description: string;
  address?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  businessInfo?: {
    type?: string;
    registrationNumber?: string;
  };
  logo?: string;
  banner?: string;
}

export interface CreateShopResponse extends Shop {}

export interface UpdateShopRequest {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  banner?: string;
}

export interface UpdateShopResponse extends Shop {}

export interface GetShopsRequest {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface GetShopsResponse {
  shops: Shop[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface GetPendingShopsRequest {
  page?: number;
  limit?: number;
}

export interface GetPendingShopsResponse {
  shops: Shop[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApproveShopRequest {
  id: string;
}

export interface ApproveShopResponse {
  message: string;
  shop: Shop;
}

export interface RejectShopRequest {
  id: string;
  reason: string;
}

export interface RejectShopResponse {
  message: string;
  shop: Shop;
}

export interface SuspendShopRequest {
  id: string;
  reason: string;
}

export interface SuspendShopResponse {
  message: string;
  shop: Shop;
}

export interface ReactivateShopRequest {
  id: string;
}

export interface ReactivateShopResponse {
  message: string;
  shop: Shop;
}

export interface GetShopByIdResponse {
  shop: Shop;
}

export interface GetShopProductsRequest {
  id: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface GetShopProductsResponse {
  shop: Shop;
  products: Array<{
    _id: string;
    name: string;
    price: number;
    images: string[];
    rating: number;
    stock: number;
    description: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ToggleFollowShopRequest {
  id: string;
}

export interface ToggleFollowShopResponse {
  message: string;
  following: boolean;
}

export interface DeleteShopResponse {
  message: string;
}

export interface ShopErrorResponse {
  message: string;
  error?: string;
}
