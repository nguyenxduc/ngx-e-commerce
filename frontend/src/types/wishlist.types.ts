import type { BaseEntity } from "./common.types";

export type WishlistItem = {
  product: string;
  addedAt: string;
};

export type Wishlist = BaseEntity & {
  user: string;
  items: WishlistItem[];
};

export type WishlistWithProducts = Omit<Wishlist, "items"> & {
  items: WishlistItemWithProduct[];
};

export type WishlistItemWithProduct = WishlistItem & {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    rating: number;
    countInStock: number;
    isActive: boolean;
    description: string;
  };
};

export type AddToWishlistRequest = {
  productId: string;
};

export type WishlistResponse = {
  id: string;
  items: WishlistItemWithProduct[];
  totalItems: number;
};
