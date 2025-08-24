import { Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  MessageCircle,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalItems } = useCartStore();

  return (
    <header className="sticky top-0 z-50 bg-base-100 shadow-sm">
      {/* Top banner */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content text-center py-2 text-sm">
        <div className="flex items-center justify-center gap-6">
          <span className="flex items-center gap-1">
            🚚 MIỄN PHÍ VẬN CHUYỂN
          </span>
          <span className="flex items-center gap-1">🔄 MIỄN PHÍ TRẢ HÀNG</span>
          <span className="flex items-center gap-1">💰 GIÁ TỐT NHẤT</span>
        </div>
      </div>

      {/* Main header */}
      <div className="navbar container mx-auto">
        {/* Logo */}
        <div className="navbar-start">
          <Link
            to="/"
            className="btn btn-ghost text-xl font-bold text-primary font-serif"
          >
            NGX
          </Link>
        </div>

        {/* Navigation Menu - Desktop */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/products?category=women">Nữ</Link>
            </li>
            <li>
              <Link to="/products?category=men">Nam</Link>
            </li>
            <li>
              <Link to="/products?category=kids">Trẻ em</Link>
            </li>
            <li>
              <Link to="/products?category=home">Nhà cửa</Link>
            </li>
            <li>
              <Link to="/products?category=beauty">Làm đẹp</Link>
            </li>
            <li>
              <Link to="/products?sale=true" className="text-error font-medium">
                SALE
              </Link>
            </li>
          </ul>
        </div>

        {/* Right side */}
        <div className="navbar-end">
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex mr-4">
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="input input-bordered input-sm w-64"
                />
                <button className="btn btn-square btn-sm">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle size="sm" />

            {/* Mobile Search */}
            <button className="btn btn-ghost btn-sm btn-circle md:hidden">
              <Search className="w-5 h-5" />
            </button>

            {/* User Account */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm btn-circle"
              >
                <User className="w-5 h-5" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                {isAuthenticated ? (
                  <>
                    {user?.role === "admin" && (
                      <li>
                        <Link to="/admin/dashboard">Quản trị</Link>
                      </li>
                    )}
                    <li>
                      <Link to="/profile">Tài khoản của tôi</Link>
                    </li>
                    <li>
                      <Link to="/orders">Đơn hàng</Link>
                    </li>
                    <li>
                      <button onClick={logout}>Đăng xuất</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login">Đăng nhập</Link>
                    </li>
                    <li>
                      <Link to="/register">Đăng ký</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Chat */}
            <Link to="/chat" className="btn btn-ghost btn-sm btn-circle">
              <MessageCircle className="w-5 h-5" />
            </Link>

            {/* Favorites */}
            <Link
              to="/favorites"
              className="btn btn-ghost btn-sm btn-circle indicator"
            >
              <Heart className="w-5 h-5" />
              <span className="badge badge-sm badge-primary indicator-item">
                0
              </span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="btn btn-ghost btn-sm btn-circle indicator"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="badge badge-sm badge-primary indicator-item">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu */}
            <div className="dropdown dropdown-end lg:hidden">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm btn-circle"
              >
                <Menu className="w-5 h-5" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link to="/products?category=women">Nữ</Link>
                </li>
                <li>
                  <Link to="/products?category=men">Nam</Link>
                </li>
                <li>
                  <Link to="/products?category=kids">Trẻ em</Link>
                </li>
                <li>
                  <Link to="/products?category=home">Nhà cửa</Link>
                </li>
                <li>
                  <Link to="/products?category=beauty">Làm đẹp</Link>
                </li>
                <li>
                  <Link to="/products?sale=true" className="text-error">
                    SALE
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
