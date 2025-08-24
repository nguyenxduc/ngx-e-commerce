import { Link } from "react-router-dom";
import { ArrowRight, Star, Clock, Truck } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            {/* Promotional Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold text-sm border border-white/30 animate-pulse">
                🔥 10% OFF
              </div>
              <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold text-sm border border-white/30">
                🎁 FREE SHIPPING
              </div>
              <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold text-sm border border-white/30">
                ⚡ FLASH SALE
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Mùa Hè{" "}
                <span className="text-yellow-300 drop-shadow-lg">Rực Rỡ</span>
                <br />
                <span className="text-3xl lg:text-5xl">2024</span>
              </h1>

              <p className="text-xl lg:text-2xl text-white/90 font-light">
                Khám phá bộ sưu tập mới nhất với giảm giá lên đến
              </p>

              <div className="flex items-baseline gap-4">
                <div className="text-6xl lg:text-8xl font-black text-yellow-300 drop-shadow-lg">
                  90%
                </div>
                <div className="text-lg lg:text-xl text-white/80">OFF</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-sm text-white/80 mb-2">Mã giảm giá:</p>
                <div className="flex items-center gap-3">
                  <code className="bg-white/20 px-4 py-2 rounded-lg font-mono font-bold text-lg">
                    SUMMER90
                  </code>
                  <button className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors">
                    📋
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products?sale=true"
                className="group bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                MUA NGAY
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products"
                className="group border-2 border-white/50 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                KHÁM PHÁ
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-5 h-5 text-yellow-300" />
                <span>Miễn phí vận chuyển</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-5 h-5 text-yellow-300" />
                <span>Giao hàng nhanh</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Star className="w-5 h-5 text-yellow-300" />
                <span>Chất lượng đảm bảo</span>
              </div>
            </div>
          </div>

          {/* Right side - Featured Products Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              {/* Top Row */}
              <div className="space-y-4 lg:space-y-6">
                <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="relative overflow-hidden rounded-xl mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=200&fit=crop"
                      alt="Summer Dress"
                      className="w-full h-32 lg:h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -30%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-semibold text-sm lg:text-base">
                      Váy Hè Thời Trang
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-300 font-bold text-lg">
                        299.000đ
                      </span>
                      <span className="text-white/60 line-through text-sm">
                        399.000đ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="relative overflow-hidden rounded-xl mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=200&fit=crop"
                      alt="Trendy Top"
                      className="w-full h-32 lg:h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      NEW
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-semibold text-sm lg:text-base">
                      Áo Kiểu Trendy
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-300 font-bold text-lg">
                        199.000đ
                      </span>
                      <span className="text-white/60 line-through text-sm">
                        250.000đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="space-y-4 lg:space-y-6 mt-8 lg:mt-12">
                <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="relative overflow-hidden rounded-xl mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=200&fit=crop"
                      alt="Casual Pants"
                      className="w-full h-32 lg:h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      HOT
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-semibold text-sm lg:text-base">
                      Quần Casual
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-300 font-bold text-lg">
                        399.000đ
                      </span>
                      <span className="text-white/60 line-through text-sm">
                        450.000đ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="relative overflow-hidden rounded-xl mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&h=200&fit=crop"
                      alt="Accessories"
                      className="w-full h-32 lg:h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      SALE
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-semibold text-sm lg:text-base">
                      Phụ Kiện
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-300 font-bold text-lg">
                        99.000đ
                      </span>
                      <span className="text-white/60 line-through text-sm">
                        120.000đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-300/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
