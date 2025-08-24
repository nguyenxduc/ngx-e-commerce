import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-base-300 text-base-content">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">NGX Shop</h3>
            <p className="text-sm mb-4">
              Chuyên cung cấp các sản phẩm thời trang chất lượng cao với giá cả hợp lý.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="btn btn-circle btn-sm">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="btn btn-circle btn-sm">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="btn btn-circle btn-sm">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="btn btn-circle btn-sm">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm hover:text-primary">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/products?category=women" className="text-sm hover:text-primary">
                  Thời trang nữ
                </Link>
              </li>
              <li>
                <Link to="/products?category=men" className="text-sm hover:text-primary">
                  Thời trang nam
                </Link>
              </li>
              <li>
                <Link to="/products?sale=true" className="text-sm hover:text-primary">
                  Khuyến mãi
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-primary">
                  Về chúng tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4">Hỗ Trợ Khách Hàng</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm hover:text-primary">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm hover:text-primary">
                  Vận chuyển
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sm hover:text-primary">
                  Đổi trả
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm hover:text-primary">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Thông Tin Liên Hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">info@ngxshop.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-base-content/20 mt-8 pt-8 text-center">
          <p className="text-sm">
            © 2024 NGX Shop. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
