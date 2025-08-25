import type { BaseEntity } from "./common.types";

export type CartItem = {
  product: string;
  quantity: number;
  price: number;
};

export type Cart = BaseEntity & {
  user: string;
  items: CartItem[];
};

export type AddToCartRequest = {
  productId: string;
  quantity: number;
};

export type UpdateCartItemRequest = {
  quantity: number;
};
