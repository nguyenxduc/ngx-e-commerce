import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  Store,
  BarChart2,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  ChevronDown,
  Tag,
  Percent,
} from "lucide-react";
import { ThemeToggle } from "../../components/shared/ThemeToggle";

interface AdminNavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".profile-dropdown") &&
        !target.closest(".notification-dropdown")
      ) {
        setIsProfileDropdownOpen(false);
        setIsNotificationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigationItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: Home },
    { path: "/admin/users", name: "Users", icon: Users },
    { path: "/admin/products", name: "Products", icon: Package },
    { path: "/admin/categories", name: "Categories", icon: Tag },
    { path: "/admin/orders", name: "Orders", icon: ShoppingCart },
    { path: "/admin/shops", name: "Shops", icon: Store },
    { path: "/admin/shop-requests", name: "Shop Requests", icon: Store },
    { path: "/admin/coupons", name: "Coupons", icon: Percent },
    { path: "/admin/reports", name: "Reports", icon: BarChart2 },
    { path: "/admin/settings", name: "Settings", icon: Settings },
  ];

  const currentPage =
    navigationItems.find((item) => item.path === location.pathname)?.name ||
    "Dashboard";

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logout clicked");
  };

  const handleToggleSidebar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Toggle sidebar clicked, current state:", isSidebarOpen);
    onToggleSidebar();
  };

  return (
    <nav className="bg-base-100 dark:bg-gray-800 shadow-sm border-b border-base-300 dark:border-gray-700 px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button and breadcrumb */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleToggleSidebar}
            className="p-2 rounded-lg text-base-content hover:text-base-content hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 relative z-10 pointer-events-auto"
            aria-label={`${isSidebarOpen ? "Ẩn" : "Hiện"} menu sidebar`}
            title={`${isSidebarOpen ? "Ẩn" : "Hiện"} menu sidebar`}
            type="button"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <span className="text-base-content/70">Admin</span>
            <span className="text-base-content/30">/</span>
            <span className="text-base-content font-semibold">
              {currentPage}
            </span>
          </div>

          {/* Mobile page title */}
          <div className="md:hidden">
            <h1 className="text-lg font-semibold text-base-content">
              {currentPage}
            </h1>
          </div>
        </div>

        {/* Right side - Notifications and Profile */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <ThemeToggle size="sm" />

          {/* Notifications */}
          <div className="relative notification-dropdown">
            <button
              onClick={() =>
                setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
              }
              className="p-2 rounded-lg text-base-content hover:text-base-content hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-error text-error-content text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                3
              </span>
            </button>

            {/* Notifications Dropdown */}
            {isNotificationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-base-100 rounded-xl shadow-xl py-1 z-50 border border-base-300 transform opacity-100 scale-100 transition-all duration-200">
                <div className="px-4 py-3 border-b border-base-300">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-base-content">
                      Notifications
                    </h3>
                    <button className="text-xs text-primary hover:text-primary-focus font-medium">
                      Mark all as read
                    </button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-base-200 border-b border-base-300 cursor-pointer transition-colors duration-150">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-base-content truncate">
                          New order received
                        </p>
                        <p className="text-sm text-base-content/70 mt-1">
                          Order #12345 has been placed by John Doe
                        </p>
                        <p className="text-xs text-base-content/50 mt-2">
                          2 minutes ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-base-200 border-b border-base-300 cursor-pointer transition-colors duration-150">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-base-content truncate">
                          Product stock low
                        </p>
                        <p className="text-sm text-base-content/70 mt-1">
                          iPhone 15 Pro is running low on stock (5 items left)
                        </p>
                        <p className="text-xs text-base-content/50 mt-2">
                          1 hour ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-base-200 cursor-pointer transition-colors duration-150">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-base-content truncate">
                          New user registered
                        </p>
                        <p className="text-sm text-base-content/70 mt-1">
                          Jane Smith has joined the platform
                        </p>
                        <p className="text-xs text-base-content/50 mt-2">
                          3 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-base-300 bg-base-200">
                  <Link
                    to="/admin/notifications"
                    className="text-sm text-primary hover:text-primary-focus font-medium flex items-center justify-center"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg text-base-content hover:text-base-content hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
              aria-label="Profile menu"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-sm">
                <User className="text-primary-content" size={16} />
              </div>
              <span className="hidden lg:block text-sm font-medium">
                Admin User
              </span>
              <ChevronDown size={16} className="hidden lg:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-base-100 rounded-xl shadow-xl py-1 z-50 border border-base-300 transform opacity-100 scale-100 transition-all duration-200">
                <div className="px-4 py-3 border-b border-base-300">
                  <p className="text-sm font-semibold text-base-content">
                    Admin User
                  </p>
                  <p className="text-sm text-base-content/70">
                    admin@example.com
                  </p>
                </div>
                <Link
                  to="/admin/profile"
                  className="block px-4 py-2 text-sm text-base-content hover:bg-base-200 transition-colors duration-150"
                >
                  Profile Settings
                </Link>
                <Link
                  to="/admin/settings"
                  className="block px-4 py-2 text-sm text-base-content hover:bg-base-200 transition-colors duration-150"
                >
                  System Settings
                </Link>
                <div className="border-t border-base-300">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-base-content hover:bg-base-200 transition-colors duration-150"
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
  );
};

export default AdminNavbar;
