import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Store,
  Star,
  MapPin,
  Phone,
  Mail,
  Package,
  Clock,
  CheckCircle,
  Filter,
  Grid,
  List,
  Heart,
  Share2,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  category: string;
}

interface Shop {
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
  openingHours: string;
  policies: {
    returnPolicy: string;
    shippingPolicy: string;
    warrantyPolicy: string;
  };
}

const ShopDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating" | "newest">(
    "newest"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock data - replace with actual API call
  const shop: Shop = {
    id: id || "1",
    name: "Tech Gadgets Store",
    description:
      "Your one-stop shop for all the latest technology gadgets and electronics. We offer competitive prices and excellent customer service.",
    category: "Electronics",
    address: "123 Tech Street, Silicon Valley, CA 94025",
    phone: "+1 (555) 123-4567",
    email: "contact@techgadgets.com",
    logo: "/api/images/shop-logo.jpg",
    banner: "/api/images/shop-banner.jpg",
    rating: 4.8,
    reviewCount: 1247,
    productCount: 156,
    isVerified: true,
    status: "active",
    createdAt: "2023-01-15",
    openingHours: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed",
    policies: {
      returnPolicy: "30-day return policy for all items",
      shippingPolicy: "Free shipping on orders over $50",
      warrantyPolicy: "1-year manufacturer warranty on all electronics",
    },
  };

  const products: Product[] = [
    {
      id: "1",
      name: "iPhone 15 Pro Max",
      price: 1199,
      originalPrice: 1299,
      image: "/api/images/iphone-15-pro-max.jpg",
      rating: 4.9,
      reviewCount: 342,
      inStock: true,
      category: "Smartphones",
    },
    {
      id: "2",
      name: "MacBook Air M2",
      price: 999,
      image: "/api/images/macbook-air-m2.jpg",
      rating: 4.8,
      reviewCount: 189,
      inStock: true,
      category: "Laptops",
    },
    {
      id: "3",
      name: "Sony WH-1000XM5",
      price: 349,
      originalPrice: 399,
      image: "/api/images/sony-wh1000xm5.jpg",
      rating: 4.7,
      reviewCount: 567,
      inStock: false,
      category: "Audio",
    },
    // Add more products...
  ];

  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const filteredProducts = products
    .filter(
      (product) =>
        selectedCategory === "all" || product.category === selectedCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price - b.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
        default:
          return 0; // Assuming products are already sorted by newest
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shop Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        {shop.banner && (
          <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <img
              src={shop.banner}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-indigo-100 rounded-lg flex items-center justify-center">
                {shop.logo ? (
                  <img
                    src={shop.logo}
                    alt={shop.name}
                    className="w-16 h-16 rounded"
                  />
                ) : (
                  <Store className="text-indigo-600" size={32} />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {shop.name}
                  </h1>
                  {shop.isVerified && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{shop.category}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(shop.rating)}
                    <span className="text-sm text-gray-600 ml-1">
                      {shop.rating} ({shop.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Package className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">
                      {shop.productCount} products
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  isFollowing
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    isFollowing ? "fill-current" : ""
                  }`}
                />
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">
                      {shop.address}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">{shop.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">{shop.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">
                      {shop.openingHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shop Policies */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Shop Policies
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Return Policy
                    </p>
                    <p className="text-xs text-gray-600">
                      {shop.policies.returnPolicy}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Shipping Policy
                    </p>
                    <p className="text-xs text-gray-600">
                      {shop.policies.shippingPolicy}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Warranty Policy
                    </p>
                    <p className="text-xs text-gray-600">
                      {shop.policies.warrantyPolicy}
                    </p>
                  </div>
                </div>
              </div>

              {/* About Shop */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  About
                </h3>
                <p className="text-sm text-gray-600">{shop.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Member since {formatDate(shop.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters and Sort */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="newest">Newest</option>
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md ${
                      viewMode === "grid"
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md ${
                      viewMode === "list"
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-1 mb-2">
                      {renderStars(product.rating)}
                      <span className="text-xs text-gray-500">
                        ({product.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          product.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto text-gray-400" size={48} />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No products found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filters or search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailPage;
