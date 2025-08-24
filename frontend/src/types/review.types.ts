export interface Review {
  _id: string;
  user:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
  product:
    | string
    | {
        _id: string;
        name: string;
      };
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateReviewRequest {
  product: string;
  rating: number;
  comment: string;
}

export interface CreateReviewResponse extends Review {}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}

export interface UpdateReviewResponse extends Review {}

export interface GetReviewsRequest {
  product?: string;
  user?: string;
  page?: number;
  limit?: number;
}

export interface GetReviewsResponse {
  reviews: Review[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    limit: number;
  };
}

export interface GetReviewByIdResponse extends Review {}

export interface DeleteReviewResponse {
  message: string;
}

export interface ReviewErrorResponse {
  message: string;
  error?: string;
}
