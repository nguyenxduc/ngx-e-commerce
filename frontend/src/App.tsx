import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import SellerLayout from "./components/shop/SellerLayout";
import { ThemeProvider } from "./components/shared/ThemeProvider";
import { ThemeDemo } from "./components/shared/ThemeDemo";
import HomePage from "./pages/client/HomePage";
import ProductsPage from "./pages/client/ProductsPage";
import ProductDetailPage from "./pages/client/ProductDetailPage";
import CartPage from "./pages/client/CartPage";
import LoginPage from "./pages/client/LoginPage";
import RegisterPage from "./pages/client/RegisterPage";
import ProfilePage from "./pages/client/ProfilePage";
import ShopDetailPage from "./pages/client/ShopDetailPage";
import ShopRequestPage from "./pages/client/ShopRequestPage";
import ShopDemoPage from "./pages/client/ShopDemoPage";
import MessagesPage from "./pages/client/MessagesPage";
import MessageThreadPage from "./pages/client/MessageThreadPage";
import ShopRequestListPage from "./pages/client/ShopRequestListPage";
import CheckoutPage from "./pages/client/CheckoutPage";
import PaymentResultPage from "./pages/client/PaymentResultPage";
import PaymentsPage from "./pages/client/PaymentsPage";
import NotFoundPage from "./pages/client/NotFoundPage";

// Admin Pages
import AdminDashboardPage from "./pages/admin/DashboardPage";
import AdminUsersPage from "./pages/admin/UsersPage";
import AdminProductsPage from "./pages/admin/ProductsPage";
import AdminCategoriesPage from "./pages/admin/CategoriesPage";
import AdminCouponsPage from "./pages/admin/CouponsPage";
import AdminOrdersPage from "./pages/admin/OrdersPage";
import AdminShopsPage from "./pages/admin/ShopsPage";
import AdminReportsPage from "./pages/admin/ReportsPage";
import AdminSettingsPage from "./pages/admin/SettingsPage";
import AdminShopRequestsPage from "./pages/admin/ShopRequestsPage";

// Seller Pages (placeholder components)
const SellerDashboardPage = () => <div>Seller Dashboard</div>;
const SellerProductsPage = () => <div>Seller Products</div>;
const SellerOrdersPage = () => <div>Seller Orders</div>;
const SellerCustomersPage = () => <div>Seller Customers</div>;
const SellerAnalyticsPage = () => <div>Seller Analytics</div>;
import SellerMessagesPage from "./pages/seller/MessagesPage";
const SellerEarningsPage = () => <div>Seller Earnings</div>;
const SellerSettingsPage = () => <div>Seller Settings</div>;

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-base-200">
        <Routes>
          {/* Admin Routes - Separate from client layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="coupons" element={<AdminCouponsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="shops" element={<AdminShopsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="shop-requests" element={<AdminShopRequestsPage />} />
          </Route>

          {/* Client Routes - With Header and Footer */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="shops/:id" element={<ShopDetailPage />} />
            <Route path="shop-request" element={<ShopRequestPage />} />
            <Route path="shop-requests" element={<ShopRequestListPage />} />
            <Route path="shop-demo" element={<ShopDemoPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="messages/:chatId" element={<MessageThreadPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="payment/result" element={<PaymentResultPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="theme-demo" element={<ThemeDemo />} />

            {/* Seller Routes */}
            <Route
              path="seller/shops/:shopId"
              element={<SellerLayout shopId="1" />}
            >
              <Route index element={<SellerDashboardPage />} />
              <Route path="products" element={<SellerProductsPage />} />
              <Route path="orders" element={<SellerOrdersPage />} />
              <Route path="customers" element={<SellerCustomersPage />} />
              <Route path="analytics" element={<SellerAnalyticsPage />} />
              <Route path="messages" element={<SellerMessagesPage />} />
              <Route path="earnings" element={<SellerEarningsPage />} />
              <Route path="settings" element={<SellerSettingsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
