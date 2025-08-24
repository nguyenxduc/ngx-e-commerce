export interface WishlistItem {
  _id: string;
  product:
    | string
    | {
        _id: string;
        name: string;
        price: number;
        image: string;
        description: string;
      };
  user: string;
  createdAt?: Date;
}

export interface Wishlist {
  _id: string;
  user: string;
  items: WishlistItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddToWishlistRequest {
  product: string;
}

export interface AddToWishlistResponse {
  message: string;
  wishlist: Wishlist;
}

export interface RemoveFromWishlistRequest {
  product: string;
}

export interface RemoveFromWishlistResponse {
  message: string;
}

export interface GetWishlistRequest {
  page?: number;
  limit?: number;
}

export interface GetWishlistResponse {
  items: WishlistItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}

export interface ClearWishlistResponse {
  message: string;
}

export interface WishlistErrorResponse {
  message: string;
  error?: string;
}
