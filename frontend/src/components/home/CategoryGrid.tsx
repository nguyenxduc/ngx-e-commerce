import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: "women",
    name: "Thời Trang Nữ",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop",
    count: 150,
    color: "from-pink-400 to-rose-500",
    icon: "👗",
  },
  {
    id: "men",
    name: "Thời Trang Nam",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    count: 120,
    color: "from-blue-400 to-indigo-500",
    icon: "👔",
  },
  {
    id: "kids",
    name: "Thời Trang Trẻ Em",
    image:
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop",
    count: 80,
    color: "from-green-400 to-emerald-500",
    icon: "👶",
  },
  {
    id: "home",
    name: "Nhà Cửa & Đời Sống",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    count: 95,
    color: "from-amber-400 to-orange-500",
    icon: "🏠",
  },
  {
    id: "beauty",
    name: "Làm Đẹp",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop",
    count: 65,
    color: "from-purple-400 to-violet-500",
    icon: "💄",
  },
  {
    id: "accessories",
    name: "Phụ Kiện",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=300&fit=crop",
    count: 110,
    color: "from-gray-400 to-slate-500",
    icon: "👜",
  },
];

const CategoryGrid = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Danh Mục Sản Phẩm
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Khám phá các danh mục sản phẩm đa dạng của chúng tôi với hàng nghìn
            sản phẩm chất lượng
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group block"
              aria-label={`Browse ${category.name} products`}
            >
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-0 group-hover:opacity-80 transition-opacity duration-500`}
                  />

                  {/* Icon */}
                  <div className="absolute top-4 right-4 text-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    {category.icon}
                  </div>

                  {/* Arrow Icon */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 lg:p-6">
                  <h3 className="font-bold text-gray-900 text-sm lg:text-base mb-2 group-hover:text-gray-700 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-xs lg:text-sm text-gray-500">
                      {category.count.toLocaleString()} sản phẩm
                    </p>
                    <div
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div
                  className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r ${category.color} opacity-0 group-hover:opacity-100 transition-all duration-500`}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Xem tất cả sản phẩm
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
