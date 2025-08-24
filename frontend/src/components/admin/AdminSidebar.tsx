import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  Store,
  BarChart2,
  Settings,
  Grid,
  TrendingUp,
  Shield,
  HelpCircle,
  Tag,
  Percent,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: Home,
      description: "Overview and analytics",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
      description: "Manage user accounts",
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
      description: "Product catalog management",
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: Tag,
      description: "Product categories management",
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingCart,
      description: "Order processing and tracking",
    },
    {
      name: "Shops",
      path: "/admin/shops",
      icon: Store,
      description: "Shop and vendor management",
    },
    {
      name: "Shop Requests",
      path: "/admin/shop-requests",
      icon: Store,
      description: "Shop registration requests",
    },
    {
      name: "Coupons",
      path: "/admin/coupons",
      icon: Percent,
      description: "Discount coupons management",
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: BarChart2,
      description: "Analytics and insights",
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
      description: "System configuration",
    },
  ];

  const quickStats = [
    {
      name: "Total Sales",
      value: "$45,231",
      change: "+20.1%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      name: "Active Users",
      value: "2,350",
      change: "+180.1%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      name: "Products",
      value: "1,234",
      change: "+19%",
      icon: Package,
      color: "text-purple-600",
    },
  ];

  return (
    <div
      className={`
      w-64 bg-base-100 dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0
      fixed inset-y-0 left-0 z-40
      lg:relative lg:z-auto
      flex-shrink-0
      border-r border-base-300 dark:border-gray-700
      flex flex-col
    `}
    >
      {/* Quick Stats */}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto min-h-0">
        <h3 className="text-xs font-semibold text-base-content/70 uppercase tracking-wider mb-3">
          Navigation
        </h3>

        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                ${
                  isActive
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-base-content hover:bg-base-200 hover:text-base-content"
                }
              `}
            >
              <item.icon
                size={18}
                className={isActive ? "text-primary" : "text-base-content/50"}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-base-300 dark:border-gray-700 flex-shrink-0">
        <div className="space-y-2">
          <Link
            to="/admin/help"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-base-content hover:bg-base-200 hover:text-base-content transition-colors duration-200"
          >
            <HelpCircle size={18} className="text-base-content/50" />
            <span>Help & Support</span>
          </Link>

          <Link
            to="/admin/security"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-base-content hover:bg-base-200 hover:text-base-content transition-colors duration-200"
          >
            <Shield size={18} className="text-base-content/50" />
            <span>Security</span>
          </Link>
        </div>

        {/* Admin Info */}
        <div className="mt-4 p-3 bg-base-200 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Users className="text-primary-content" size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-base-content">
                Admin User
              </p>
              <p className="text-xs text-base-content/70">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
