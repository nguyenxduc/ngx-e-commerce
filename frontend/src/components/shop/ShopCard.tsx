import React from "react";
import { Link } from "react-router-dom";
import { Store, Star, MapPin, Phone, Mail, Package } from "lucide-react";

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
}

interface ShopCardProps {
  shop: Shop;
  variant?: "default" | "compact" | "detailed";
  showActions?: boolean;
  onEdit?: (shop: Shop) => void;
  onDelete?: (shop: Shop) => void;
}

const ShopCard: React.FC<ShopCardProps> = ({
  shop,
  variant = "default",
  showActions = false,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: Shop["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (variant === "compact") {
    return (
      <Link to={`/shops/${shop.id}`} className="block">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {shop.logo ? (
                <img
                  src={shop.logo}
                  alt={shop.name}
                  className="w-8 h-8 rounded"
                />
              ) : (
                <Store className="text-indigo-600" size={20} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {shop.name}
                </h3>
                {shop.isVerified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">{shop.category}</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  <Star className="text-yellow-400" size={12} />
                  <span className="text-xs text-gray-600">{shop.rating}</span>
                </div>
                <span className="text-xs text-gray-400">
                  ({shop.reviewCount})
                </span>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  shop.status
                )}`}
              >
                {shop.status}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "detailed") {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Banner */}
        {shop.banner && (
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <img
              src={shop.banner}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                {shop.logo ? (
                  <img
                    src={shop.logo}
                    alt={shop.name}
                    className="w-12 h-12 rounded"
                  />
                ) : (
                  <Store className="text-indigo-600" size={24} />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {shop.name}
                  </h2>
                  {shop.isVerified && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">{shop.category}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-400" size={14} />
                    <span className="text-sm font-medium">{shop.rating}</span>
                    <span className="text-sm text-gray-500">
                      ({shop.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Package className="text-gray-400" size={14} />
                    <span className="text-sm text-gray-500">
                      {shop.productCount} products
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                shop.status
              )}`}
            >
              {shop.status}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-4">{shop.description}</p>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="text-gray-400" size={16} />
              <span className="text-sm text-gray-600">{shop.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="text-gray-400" size={16} />
              <span className="text-sm text-gray-600">{shop.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="text-gray-400" size={16} />
              <span className="text-sm text-gray-600">{shop.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Joined: {formatDate(shop.createdAt)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Link
              to={`/shops/${shop.id}`}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
            >
              View Shop
            </Link>

            {showActions && (
              <div className="flex items-center space-x-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(shop)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(shop)}
                    className="inline-flex items-center px-3 py-1 border border-red-300 text-sm text-red-700 rounded-md hover:bg-red-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <Link to={`/shops/${shop.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Banner */}
        {shop.banner && (
          <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600">
            <img
              src={shop.banner}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                {shop.logo ? (
                  <img
                    src={shop.logo}
                    alt={shop.name}
                    className="w-8 h-8 rounded"
                  />
                ) : (
                  <Store className="text-indigo-600" size={20} />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900">{shop.name}</h3>
                  {shop.isVerified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">{shop.category}</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                shop.status
              )}`}
            >
              {shop.status}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {shop.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Star className="text-yellow-400" size={14} />
              <span>{shop.rating}</span>
              <span>({shop.reviewCount})</span>
            </div>
            <div className="flex items-center space-x-1">
              <Package className="text-gray-400" size={14} />
              <span>{shop.productCount} products</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;
