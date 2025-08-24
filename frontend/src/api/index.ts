export { authService } from "./auth.service";
export { cartService } from "./cart.service";
export { couponService } from "./coupon.service";
export { productService } from "./product.service";
export { orderService } from "./order.service";
export { shopService } from "./shop.service";
export { reviewService } from "./review.service";
export { wishlistService } from "./wishlist.service";
export { chatService } from "./chat.service";
export { paymentService } from "./payment.service";
export { notificationService } from "./notification.service";
export { analyticsService } from "./analytics.service";

// Export types from payment and notification services
export type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentStatusResponse,
  PaymentErrorResponse,
} from "./payment.service";

export type {
  Notification,
  GetNotificationsRequest,
  GetNotificationsResponse,
  MarkAsReadRequest,
  MarkAsReadResponse,
  DeleteNotificationResponse,
} from "./notification.service";

export type {
  SalesAnalytics,
  ProductAnalytics,
  UserAnalytics,
  ShopAnalytics,
  GetAnalyticsRequest,
  GetAnalyticsResponse,
} from "./analytics.service";
