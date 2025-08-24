import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { productService } from "@/api/product.service";
import type { Product } from "@/types";

const ProductSections = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const [featured, newArr, best] = await Promise.all([
          productService.getFeaturedProducts(8),
          productService.getNewArrivals(8),
          productService.getBestSellers(8),
        ]);

        setFeaturedProducts(featured);
        setNewArrivals(newArr);
        setBestSellers(best);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
        // Fallback to mock data if API fails
        setFeaturedProducts(mockProducts);
        setNewArrivals(mockProducts);
        setBestSellers(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const mockProducts: Product[] = [
    {
      _id: "1",
      name: "Váy Hè Thời Trang Nữ",
      description: "Váy đẹp cho mùa hè với chất liệu thoáng mát",
      price: 299000,
      originalPrice: 399000,
      image:
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop",
      brand: "Fashion Brand",
      category: {
        _id: "women",
        name: "Thời Trang Nữ",
      },
      seller: {
        _id: "1",
        name: "Fashion Store",
      },
      shop: {
        _id: "1",
        name: "Fashion Store",
      },
      countInStock: 50,
      ratings: 4.5,
      numReviews: 128,
      reviews: [],
      status: "active",
      isFeatured: true,
      discountPercentage: 25,
      tags: ["vay", "he", "thoi-trang"],
      variants: [
        {
          name: "Size",
          options: ["S", "M", "L"],
        },
        {
          name: "Color",
          options: ["Đỏ", "Xanh", "Trắng"],
        },
      ],
      shippingInfo: {
        freeShipping: true,
      },
      isNewProduct: false,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    },
    {
      _id: "2",
      name: "Áo Kiểu Trendy Thời Trang",
      description: "Áo kiểu thời trang với thiết kế hiện đại",
      price: 199000,
      originalPrice: 250000,
      image:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop",
      brand: "Trendy Brand",
      category: {
        _id: "women",
        name: "Thời Trang Nữ",
      },
      seller: {
        _id: "1",
        name: "Fashion Store",
      },
      shop: {
        _id: "1",
        name: "Fashion Store",
      },
      countInStock: 30,
      ratings: 4.3,
      numReviews: 95,
      reviews: [],
      status: "active",
      isFeatured: true,
      discountPercentage: 20,
      tags: ["ao", "trendy", "thoi-trang"],
      variants: [
        {
          name: "Size",
          options: ["S", "M", "L"],
        },
        {
          name: "Color",
          options: ["Đen", "Trắng", "Hồng"],
        },
      ],
      shippingInfo: {
        freeShipping: true,
      },
      isNewProduct: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    },
    {
      _id: "3",
      name: "Quần Casual Nam Thoải Mái",
      description: "Quần casual thoải mải cho nam giới",
      price: 399000,
      originalPrice: 450000,
      image:
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=400&fit=crop",
      brand: "Casual Brand",
      category: {
        _id: "men",
        name: "Thời Trang Nam",
      },
      seller: {
        _id: "1",
        name: "Fashion Store",
      },
      shop: {
        _id: "1",
        name: "Fashion Store",
      },
      countInStock: 25,
      ratings: 4.7,
      numReviews: 156,
      reviews: [],
      status: "active",
      isFeatured: true,
      discountPercentage: 11,
      tags: ["quan", "casual", "nam"],
      variants: [
        {
          name: "Size",
          options: ["M", "L", "XL"],
        },
        {
          name: "Color",
          options: ["Xanh", "Đen", "Xám"],
        },
      ],
      shippingInfo: {
        freeShipping: true,
      },
      isNewProduct: false,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    },
    {
      _id: "4",
      name: "Phụ Kiện Thời Trang Đẹp",
      description: "Phụ kiện thời trang với thiết kế độc đáo",
      price: 99000,
      originalPrice: 120000,
      image:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&h=400&fit=crop",
      brand: "Accessory Brand",
      category: {
        _id: "accessories",
        name: "Phụ Kiện",
      },
      seller: {
        _id: "1",
        name: "Fashion Store",
      },
      shop: {
        _id: "1",
        name: "Fashion Store",
      },
      countInStock: 100,
      ratings: 4.2,
      numReviews: 78,
      reviews: [],
      status: "active",
      isFeatured: true,
      discountPercentage: 18,
      tags: ["phu-kien", "thoi-trang"],
      variants: [
        {
          name: "Size",
          options: ["One Size"],
        },
        {
          name: "Color",
          options: ["Đen", "Trắng", "Vàng"],
        },
      ],
      shippingInfo: {
        freeShipping: false,
      },
      isNewProduct: false,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    },
  ];

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />

        {/* Discount Badge */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -
            {Math.round(
              ((product.originalPrice - product.price) /
                product.originalPrice) *
                100
            )}
            %
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-200 shadow-lg">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-200 shadow-lg">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Quick Add to Cart */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full bg-white text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Thêm vào giỏ
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6">
        <Link to={`/products/${product._id}`} className="block">
          <h3 className="font-bold text-gray-900 text-sm lg:text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.ratings)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.numReviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-lg text-primary">
            {product.price.toLocaleString("vi-VN")}đ
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              {product.originalPrice.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>

        {/* Shop Info */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 truncate">
            {product.shop.name}
          </span>
          <div
            className={`w-2 h-2 rounded-full ${
              product.countInStock > 0 ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
          <div className="p-4 lg:p-6 space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );

  const ProductSection = ({
    title,
    subtitle,
    products,
    viewAllLink,
    gradient,
  }: {
    title: string;
    subtitle: string;
    products: Product[];
    viewAllLink: string;
    gradient: string;
  }) => (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex-1">
            <h2
              className={`text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
            >
              {title}
            </h2>
            <p className="text-lg text-gray-600">{subtitle}</p>
          </div>
          <Link
            to={viewAllLink}
            className="group hidden lg:flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="text-center mt-8 lg:hidden">
          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white">
      <ProductSection
        title="Sản Phẩm Nổi Bật"
        subtitle="Những sản phẩm được yêu thích nhất từ khách hàng"
        products={featuredProducts}
        viewAllLink="/products?featured=true"
        gradient="from-orange-500 to-red-500"
      />

      <ProductSection
        title="Hàng Mới Về"
        subtitle="Những sản phẩm mới nhất với thiết kế độc đáo"
        products={newArrivals}
        viewAllLink="/products?sort=newest"
        gradient="from-blue-500 to-purple-500"
      />

      <ProductSection
        title="Bán Chạy Nhất"
        subtitle="Những sản phẩm bán chạy nhất trong tháng"
        products={bestSellers}
        viewAllLink="/products?sort=best-selling"
        gradient="from-green-500 to-emerald-500"
      />
    </div>
  );
};

export default ProductSections;
