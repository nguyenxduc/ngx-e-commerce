# API Documentation - E-commerce Fashion Store

## Base URL
```
http://localhost:3000/api
```

## Authentication
Hầu hết các endpoints yêu cầu authentication. Sử dụng JWT token trong header:
```
Authorization: Bearer <token>
```

## Endpoints

### 🔐 Authentication
```
POST /auth/register - Đăng ký
POST /auth/login - Đăng nhập
POST /auth/logout - Đăng xuất
GET /auth/me - Lấy thông tin user hiện tại
```

### 📦 Products
```
GET /products - Lấy tất cả sản phẩm (có filter, sort, pagination)
GET /products/featured - Lấy sản phẩm nổi bật
GET /products/category/:category - Lấy sản phẩm theo danh mục
GET /products/recommendations - Lấy sản phẩm gợi ý
GET /products/:id - Lấy sản phẩm theo ID
GET /products/seller/products - Lấy sản phẩm của seller (Seller only)
GET /products/seller/stats - Thống kê sản phẩm của seller (Seller only)
POST /products - Tạo sản phẩm mới (Admin/Seller only)
PUT /products/:id - Cập nhật sản phẩm (Admin/Seller only)
PATCH /products/:id - Toggle featured product (Admin only)
DELETE /products/:id - Xóa sản phẩm (Admin/Seller only)
```

### 📂 Categories
```
GET /categories - Lấy tất cả danh mục
GET /categories/:id - Lấy danh mục theo ID
POST /categories - Tạo danh mục mới (Admin only)
PUT /categories/:id - Cập nhật danh mục (Admin only)
DELETE /categories/:id - Xóa danh mục (Admin only)
```

### ⭐ Reviews
```
GET /reviews/product/:productId - Lấy review của sản phẩm
GET /reviews/user - Lấy review của user hiện tại
POST /reviews - Tạo review mới
PUT /reviews/:id - Cập nhật review
DELETE /reviews/:id - Xóa review
```

### 🛒 Cart
```
GET /cart - Lấy giỏ hàng của user
POST /cart/add - Thêm sản phẩm vào giỏ hàng
PUT /cart/update/:productId - Cập nhật số lượng
DELETE /cart/remove/:productId - Xóa sản phẩm khỏi giỏ hàng
DELETE /cart/clear - Xóa toàn bộ giỏ hàng
```

### 🎫 Coupons
```
GET /coupons - Lấy mã giảm giá của user
POST /coupons/validate - Validate mã giảm giá
POST /coupons - Tạo mã giảm giá mới (Admin only)
DELETE /coupons/:id - Xóa mã giảm giá (Admin only)
```

### 📦 Orders
```
POST /orders - Tạo đơn hàng mới
GET /orders/user/orders - Lấy đơn hàng của user
GET /orders/:id - Lấy đơn hàng theo ID
GET /orders - Lấy tất cả đơn hàng (Admin only)
PATCH /orders/:id/status - Cập nhật trạng thái đơn hàng (Admin only)
DELETE /orders/:id - Xóa đơn hàng (Admin only)
GET /orders/stats/overview - Thống kê đơn hàng (Admin only)
```

### 🛍️ Seller Management
```
GET /seller/orders - Lấy đơn hàng của seller (Seller only)
GET /seller/sales-stats - Thống kê bán hàng của seller (Seller only)
GET /seller/reviews - Lấy feedback của seller (Seller only)
PATCH /seller/orders/:orderId/status - Cập nhật trạng thái đơn hàng (Seller only)
```

### 💳 Payments
```
POST /payments/create-payment-intent - Tạo payment intent
POST /payments/confirm - Xác nhận thanh toán
```

### 📊 Analytics (Admin only)
```
GET /analytics/overview - Tổng quan thống kê
GET /analytics/sales - Thống kê doanh thu
GET /analytics/products - Thống kê sản phẩm
GET /analytics/users - Thống kê người dùng
```

## Query Parameters

### Products Filtering
```
?page=1&limit=10 - Pagination
?category=categoryId - Filter theo danh mục
?brand=brandName - Filter theo thương hiệu
?minPrice=100000&maxPrice=500000 - Filter theo giá
?sort=price_asc|price_desc|newest|rating - Sắp xếp
```

### Orders Filtering
```
?page=1&limit=10 - Pagination
?status=delivered|pending - Filter theo trạng thái
?userId=userId - Filter theo user (Admin only)
```

## Response Format

### Success Response
```json
{
  "data": {...},
  "message": "Success message"
}
```

### Error Response
```json
{
  "message": "Error message",
  "error": "Detailed error info"
}
```

### Paginated Response
```json
{
  "data": [...],
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

## User Roles

- **customer**: Khách hàng thường
- **admin**: Quản trị viên
- **seller**: Người bán

## Environment Variables

```env
MONGO_URI=mongodb://localhost:27017/fashion-store
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
STRIPE_SECRET_KEY=your-stripe-secret
```

## Running the Server

```bash
cd backend
npm install
npm run dev
```

## Database Seeding

```bash
cd backend
node seed.js
```

Sau khi chạy seed, bạn có thể đăng nhập với:
- Admin: `admin@fashion.com` / `123456`
- Seller: `seller@fashion.com` / `123456`
- Customer: `customer1@example.com` / `123456` 