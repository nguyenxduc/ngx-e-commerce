import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  Plus,
  Eye,
  Settings,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { ShopCard, SellerDashboard } from "../../components/shop";
import { getShops, getShopStats } from "../../api/shop.service";
import { getRecentOrders } from "../../api/order.service";
import { productService } from "../../api/product.service";
import type { Shop, ShopStats } from "../../types/shop.types";
import type { Order } from "../../types/order.types";
import type { Product } from "../../types/product.types";

// Adapter interfaces for components
interface ShopCardData {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  banner?: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  isVerified: boolean;
  status: "active" | "inactive" | "pending";
  createdAt: string;
}

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  averageRating: number;
  totalViews: number;
  pendingOrders: number;
  lowStockProducts: number;
}

interface RecentOrderData {
  id: string;
  customerName: string;
  productName: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

interface TopProductData {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image?: string;
}

// Adapter functions to convert API data to component interfaces
const adaptShopForCard = (shop: Shop): ShopCardData => ({
  id: shop._id,
  name: shop.name,
  description: shop.description,
  category: shop.categories?.[0]?.name || "General",
  address: `${shop.address.street}, ${shop.address.city}, ${shop.address.state} ${shop.address.postalCode}`,
  phone: shop.contactInfo.phone,
  email: shop.contactInfo.email,
  logo: shop.logo,
  banner: shop.banner,
  rating: shop.rating,
  reviewCount: shop.totalRatings,
  productCount: 0, // This would need to come from a separate API call
  isVerified: shop.isVerified,
  status:
    shop.status === "approved"
      ? "active"
      : shop.status === "pending"
      ? "pending"
      : "inactive",
  createdAt: shop.createdAt,
});

const adaptShopStatsForDashboard = (stats: ShopStats): DashboardStats => ({
  totalProducts: stats.totalProducts,
  totalOrders: stats.totalOrders,
  totalRevenue: stats.totalRevenue,
  totalCustomers: stats.totalFollowers || 0,
  averageRating: stats.averageRating,
  totalViews: 0, // This would need to come from a separate API call
  pendingOrders: 0, // This would need to come from a separate API call
  lowStockProducts: 0, // This would need to come from a separate API call
});

const adaptOrderForDashboard = (order: Order): RecentOrderData => ({
  id: order._id,
  customerName: order.user?.name || "Unknown Customer",
  productName: order.items?.[0]?.product?.name || "Unknown Product",
  amount: order.totalAmount,
  status: order.status,
  date: order.createdAt,
});

const adaptProductForDashboard = (product: Product): TopProductData => ({
  id: product._id,
  name: product.name,
  sales: product.numReviews || 0, // Using numReviews as a proxy for sales
  revenue: product.price * (product.numReviews || 0),
  image: product.image,
});

export default function ShopDemoPage() {
  const [selectedDemo, setSelectedDemo] = useState<
    "shop-card" | "seller-dashboard"
  >("shop-card");

  // State for shops
  const [shops, setShops] = useState<Shop[]>([]);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [shopsError, setShopsError] = useState<string | null>(null);

  // State for shop stats
  const [shopStats, setShopStats] = useState<ShopStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  // State for recent orders
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // State for top products
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Fetch shops data
  const fetchShops = async () => {
    try {
      setShopsLoading(true);
      setShopsError(null);
      const response = await getShops({ limit: 10, status: "approved" });
      setShops(response.data);
    } catch (error) {
      console.error("Error fetching shops:", error);
      setShopsError("Failed to load shops. Please try again.");
    } finally {
      setShopsLoading(false);
    }
  };

  // Fetch shop stats
  const fetchShopStats = async (shopId: string) => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      const response = await getShopStats(shopId);
      setShopStats(response.data);
    } catch (error) {
      console.error("Error fetching shop stats:", error);
      setStatsError("Failed to load shop statistics.");
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch recent orders
  const fetchRecentOrders = async (shopId: string) => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      const response = await getRecentOrders(shopId, 5);
      setRecentOrders(response.data);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      setOrdersError("Failed to load recent orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch top products
  const fetchTopProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);
      const products = await productService.getBestSellers(5);
      setTopProducts(products);
    } catch (error) {
      console.error("Error fetching top products:", error);
      setProductsError("Failed to load top products.");
    } finally {
      setProductsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchShops();
    fetchTopProducts();
  }, []);

  // Load dashboard data when switching to seller dashboard
  useEffect(() => {
    if (selectedDemo === "seller-dashboard" && shops.length > 0) {
      const firstShopId = shops[0]._id;
      fetchShopStats(firstShopId);
      fetchRecentOrders(firstShopId);
    }
  }, [selectedDemo, shops]);

  // Error component
  const ErrorMessage = ({
    message,
    onRetry,
  }: {
    message: string;
    onRetry?: () => void;
  }) => (
    <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <AlertCircle className="text-red-500" size={20} />
        <div>
          <p className="text-red-700 font-medium">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-red-600 hover:text-red-800 text-sm underline mt-1"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <RefreshCw className="animate-spin text-indigo-600" size={24} />
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shop Features Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the shop-related features we've built for the e-commerce
            platform
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setSelectedDemo("shop-card")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedDemo === "shop-card"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Shop Cards
            </button>
            <button
              onClick={() => setSelectedDemo("seller-dashboard")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedDemo === "seller-dashboard"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Seller Dashboard
            </button>
          </div>
        </div>

        {/* Demo Content */}
        {selectedDemo === "shop-card" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Shop Card Components
              </h2>
              <p className="text-gray-600 mb-6">
                Different variants of shop cards for displaying shop information
                in various contexts.
              </p>
            </div>

            {/* Error handling for shops */}
            {shopsError && (
              <ErrorMessage message={shopsError} onRetry={fetchShops} />
            )}

            {/* Loading state for shops */}
            {shopsLoading && <LoadingSpinner />}

            {/* Shop cards when data is loaded */}
            {!shopsLoading && !shopsError && shops.length > 0 && (
              <>
                {/* Default Variant */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Default Variant
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shops.map((shop) => (
                      <ShopCard key={shop._id} shop={adaptShopForCard(shop)} />
                    ))}
                  </div>
                </div>

                {/* Compact Variant */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Compact Variant
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shops.map((shop) => (
                      <ShopCard
                        key={shop._id}
                        shop={adaptShopForCard(shop)}
                        variant="compact"
                      />
                    ))}
                  </div>
                </div>

                {/* Detailed Variant */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Detailed Variant
                  </h3>
                  <div className="space-y-6">
                    {shops.map((shop) => (
                      <ShopCard
                        key={shop._id}
                        shop={adaptShopForCard(shop)}
                        variant="detailed"
                      />
                    ))}
                  </div>
                </div>

                {/* With Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    With Actions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shops.map((shop) => (
                      <ShopCard
                        key={shop._id}
                        shop={adaptShopForCard(shop)}
                        showActions={true}
                        onEdit={(shop) => console.log("Edit shop:", shop)}
                        onDelete={(shop) => console.log("Delete shop:", shop)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* No shops message */}
            {!shopsLoading && !shopsError && shops.length === 0 && (
              <div className="text-center py-12">
                <Store className="mx-auto text-gray-400" size={48} />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No shops found
                </h3>
                <p className="mt-2 text-gray-600">
                  There are no approved shops available at the moment.
                </p>
              </div>
            )}
          </div>
        )}

        {selectedDemo === "seller-dashboard" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Seller Dashboard
              </h2>
              <p className="text-gray-600 mb-6">
                Complete dashboard for sellers to manage their shops, products,
                orders, and analytics.
              </p>
            </div>

            {/* Error handling for dashboard data */}
            {(statsError || ordersError || productsError) && (
              <div className="space-y-4">
                {statsError && <ErrorMessage message={statsError} />}
                {ordersError && <ErrorMessage message={ordersError} />}
                {productsError && <ErrorMessage message={productsError} />}
              </div>
            )}

            {/* Loading state for dashboard */}
            {(statsLoading || ordersLoading || productsLoading) && (
              <LoadingSpinner />
            )}

            {/* Dashboard when data is loaded */}
            {!statsLoading &&
              !ordersLoading &&
              !productsLoading &&
              !statsError &&
              !ordersError &&
              !productsError &&
              shopStats &&
              shops.length > 0 && (
                <SellerDashboard
                  shopStats={adaptShopStatsForDashboard(shopStats)}
                  recentOrders={recentOrders.map(adaptOrderForDashboard)}
                  topProducts={topProducts.map(adaptProductForDashboard)}
                  shopId={shops[0]._id}
                />
              )}

            {/* No data message */}
            {!statsLoading &&
              !ordersLoading &&
              !productsLoading &&
              !statsError &&
              !ordersError &&
              !productsError &&
              (!shopStats || shops.length === 0) && (
                <div className="text-center py-12">
                  <Settings className="mx-auto text-gray-400" size={48} />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No dashboard data available
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Please ensure you have shops and data to display.
                  </p>
                </div>
              )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/shop-request"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Plus className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Request Shop
                </p>
                <p className="text-xs text-gray-500">Apply to open a shop</p>
              </div>
            </Link>

            {shops.length > 0 && (
              <Link
                to={`/shops/${shops[0]._id}`}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Eye className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">View Shop</p>
                  <p className="text-xs text-gray-500">See shop details</p>
                </div>
              </Link>
            )}

            {shops.length > 0 && (
              <Link
                to={`/seller/shops/${shops[0]._id}`}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Settings className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Seller Panel
                  </p>
                  <p className="text-xs text-gray-500">Manage your shop</p>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Features Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Store className="text-indigo-600" size={24} />
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                Shop Registration
              </h4>
              <p className="text-xs text-gray-600">
                Complete form with document upload
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Eye className="text-green-600" size={24} />
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                Shop Display
              </h4>
              <p className="text-xs text-gray-600">
                Multiple card variants and layouts
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Settings className="text-purple-600" size={24} />
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                Seller Dashboard
              </h4>
              <p className="text-xs text-gray-600">
                Complete management interface
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Store className="text-orange-600" size={24} />
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                Shop Management
              </h4>
              <p className="text-xs text-gray-600">
                Products, orders, analytics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
