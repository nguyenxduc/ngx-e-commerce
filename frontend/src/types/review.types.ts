import type { BaseEntity } from "./common.types";

export type Review = BaseEntity & {
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
  isActive: boolean;
};

export type CreateReviewRequest = {
  productId: string;
  rating: number;
  comment?: string;
};

export type UpdateReviewRequest = {
  rating?: number;
  comment?: string;
  isActive?: boolean;
};

export type ReviewFilters = {
  product?: string;
  user?: string;
  rating?: number;
  sortBy?: "rating" | "createdAt";
  sortOrder?: "asc" | "desc";
};
