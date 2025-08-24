import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Store,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  MessageSquare,
  Users,
  DollarSign,
  Menu,
  X,
  LogOut,
  User,
  Bell,
} from "lucide-react";

interface SellerLayoutProps {
  shopId: string;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ shopId }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard",
      path: `/seller/shops/${shopId}`,
      icon: Store,
      description: "Overview and analytics",
    },
    {
      name: "Products",
      path: `/seller/shops/${shopId}/products`,
      icon: Package,
      description: "Manage your products",
    },
    {
      name: "Orders",
      path: `/seller/shops/${shopId}/orders`,
      icon: ShoppingCart,
      description: "Process customer orders",
    },
    {
      name: "Customers",
      path: `/seller/shops/${shopId}/customers`,
      icon: Users,
      description: "View customer data",
    },
    {
      name: "Analytics",
      path: `/seller/shops/${shopId}/analytics`,
      icon: BarChart3,
      description: "Sales and performance",
    },
    {
      name: "Messages",
      path: `/seller/shops/${shopId}/messages`,
      icon: MessageSquare,
      description: "Customer inquiries",
    },
    {
      name: "Earnings",
      path: `/seller/shops/${shopId}/earnings`,
      icon: DollarSign,
      description: "Track your revenue",
    },
    {
      name: "Settings",
      path: `/seller/shops/${shopId}/settings`,
      icon: Settings,
      description: "Shop configuration",
    },
  ];

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logout clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-0
      `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Store className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Seller Panel
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
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
                      ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <item.icon
                  size={18}
                  className={isActive ? "text-indigo-700" : "text-gray-400"}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200">
          {/* Shop Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <Store className="text-white" size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Tech Gadgets Store
                </p>
                <p className="text-xs text-gray-500">Active Shop</p>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <User className="text-white" size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">John Seller</p>
                <p className="text-xs text-gray-500">Shop Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`lg:ml-64 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Top Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Menu button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* Breadcrumb */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <span>Seller</span>
                <span>/</span>
                <span className="text-gray-900 font-medium">
                  {navigationItems.find(
                    (item) => item.path === location.pathname
                  )?.name || "Dashboard"}
                </span>
              </div>
            </div>

            {/* Right side - Notifications and Profile */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
                  }
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 relative"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    2
                  </span>
                </button>

                {/* Notifications Dropdown */}
                {isNotificationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              New order received
                            </p>
                            <p className="text-sm text-gray-500">
                              Order #12345 has been placed
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              2 minutes ago
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Payment received
                            </p>
                            <p className="text-sm text-gray-500">
                              $299.99 payment for order #12344
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              1 hour ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <Link
                        to={`/seller/shops/${shopId}/notifications`}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <User className="text-white" size={16} />
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    John Seller
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        John Seller
                      </p>
                      <p className="text-sm text-gray-500">john@seller.com</p>
                    </div>
                    <Link
                      to={`/seller/shops/${shopId}/profile`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile Settings
                    </Link>
                    <Link
                      to={`/seller/shops/${shopId}/settings`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Shop Settings
                    </Link>
                    <div className="border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center space-x-2">
                          <LogOut size={16} />
                          <span>Sign out</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default SellerLayout;
