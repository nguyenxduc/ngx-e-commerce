export interface CartItem {
  _id: string;
  product: CartProduct;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
}

export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  countInStock: number;
  status: string;
  description: string;
  brand: string;
}

export interface AddToCartRequest {
  product: string;
  quantity?: number;
}

export interface AddToCartResponse {
  message: string;
  cart: Cart;
}

export interface GetCartProductsRequest {
  page?: number;
  limit?: number;
}

export interface GetCartProductsResponse {
  items: CartItem[];
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
}

export interface RemoveAllFromCartResponse {
  message: string;
}

export interface UpdateQuantityRequest {
  quantity: number;
}

export interface UpdateQuantityResponse {
  message: string;
  cart: Cart;
}

export interface CartErrorResponse {
  message: string;
  error?: string;
}
