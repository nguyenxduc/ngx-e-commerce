import type { BaseEntity } from "./common.types";

export type Product = BaseEntity & {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  shop: string;
  countInStock: number;
  ratings: number;
  numReviews: number;
  reviews: string[];
  isActive: boolean;
};

export type CreateProductRequest = {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  countInStock: number;
};

export type UpdateProductRequest = {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  countInStock?: number;
  isActive?: boolean;
};

export type ProductFilters = {
  category?: string;
  shop?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?: string;
  sortBy?: "price" | "rating" | "createdAt" | "name";
  sortOrder?: "asc" | "desc";
};
