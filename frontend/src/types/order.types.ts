export interface OrderItem {
  _id: string;
  product: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  shopId: string;
}

export interface Order {
  _id: string;
  user:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
  items: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  isPaid: boolean;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  totalAmount: number;
  discountAmount: number;
  couponCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateOrderRequest {
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  couponCode?: string;
}

export interface CreateOrderResponse extends Order {}

export interface GetOrdersRequest {
  page?: number;
  limit?: number;
  status?: string;
}

export interface GetOrdersResponse {
  orders: Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    limit: number;
  };
}

export interface GetOrderByIdResponse extends Order {}

export interface UpdateOrderStatusRequest {
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

export interface UpdateOrderStatusResponse extends Order {}

export interface DeleteOrderResponse {
  message: string;
}

export interface OrderErrorResponse {
  message: string;
  error?: string;
}
