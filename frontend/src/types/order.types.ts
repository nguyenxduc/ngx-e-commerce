import type {
  BaseEntity,
  Address,
  OrderStatus,
  PaymentMethod,
} from "./common.types";

export type OrderItem = {
  product: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  shopId: string;
};

export type Order = BaseEntity & {
  user: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  couponCode: string;
};

export type CreateOrderRequest = {
  items: {
    product: string;
    quantity: number;
  }[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  couponCode?: string;
};

export type UpdateOrderStatusRequest = {
  status: OrderStatus;
};
