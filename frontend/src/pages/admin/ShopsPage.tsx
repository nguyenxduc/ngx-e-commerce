import { useState, useEffect } from "react";
import {
  Search,
  Store,
  User,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
} from "lucide-react";
import type { AdminShop } from "../../types/admin.types";

export default function AdminShopsPage() {
  const [shops, setShops] = useState<AdminShop[]>([]);
  const [filteredShops, setFilteredShops] = useState<AdminShop[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockShops: AdminShop[] = [
      {
        id: "1",
        name: "TechStore Pro",
        owner: { id: "1", name: "John Smith", email: "john@techstore.com" },
        category: "Electronics",
        status: "active",
        verified: true,
        rating: 4.8,
        totalProducts: 156,
        totalSales: 12500,
        createdAt: "2024-01-01",
      },
      {
        id: "2",
        name: "HealthGear Plus",
        owner: { id: "2", name: "Jane Doe", email: "jane@healthgear.com" },
        category: "Health & Fitness",
        status: "active",
        verified: true,
        rating: 4.6,
        totalProducts: 89,
        totalSales: 8900,
        createdAt: "2024-01-02",
      },
      {
        id: "3",
        name: "Fashion Boutique",
        owner: { id: "3", name: "Bob Wilson", email: "bob@fashion.com" },
        category: "Fashion",
        status: "pending",
        verified: false,
        rating: 0,
        totalProducts: 0,
        totalSales: 0,
        createdAt: "2024-01-03",
      },
      {
        id: "4",
        name: "Home & Garden",
        owner: { id: "4", name: "Alice Brown", email: "alice@homegarden.com" },
        category: "Home & Garden",
        status: "suspended",
        verified: false,
        rating: 3.2,
        totalProducts: 45,
        totalSales: 3200,
        createdAt: "2024-01-04",
      },
      {
        id: "5",
        name: "Sports Equipment",
        owner: { id: "5", name: "Charlie Davis", email: "charlie@sports.com" },
        category: "Sports",
        status: "active",
        verified: true,
        rating: 4.4,
        totalProducts: 123,
        totalSales: 7800,
        createdAt: "2024-01-05",
      },
    ];
    setShops(mockShops);
    setFilteredShops(mockShops);
  }, []);

  useEffect(() => {
    let filtered = shops;

    if (searchTerm) {
      filtered = filtered.filter(
        (shop) =>
          shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.owner.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((shop) => shop.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((shop) => shop.status === statusFilter);
    }

    if (verificationFilter !== "all") {
      filtered = filtered.filter((shop) =>
        verificationFilter === "verified" ? shop.verified : !shop.verified
      );
    }

    setFilteredShops(filtered);
  }, [shops, searchTerm, categoryFilter, statusFilter, verificationFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Electronics":
        return "bg-blue-100 text-blue-800";
      case "Health & Fitness":
        return "bg-green-100 text-green-800";
      case "Fashion":
        return "bg-purple-100 text-purple-800";
      case "Home & Garden":
        return "bg-yellow-100 text-yellow-800";
      case "Sports":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatSales = (sales: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(sales * 24000);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "pending":
        return "Chờ xử lý";
      case "suspended":
        return "Tạm khóa";
      default:
        return status;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý cửa hàng</h1>
          <p className="text-gray-600 mt-2">
            Quản lý tất cả cửa hàng trong hệ thống
          </p>
        </div>

        {/* Header Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm cửa hàng..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tất cả danh mục</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Sports">Sports</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="suspended">Tạm khóa</option>
                </select>

                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tất cả xác thực</option>
                  <option value="verified">Đã xác thực</option>
                  <option value="unverified">Chưa xác thực</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Shops Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cửa hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chủ sở hữu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh số
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Store className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {shop.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {shop.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {shop.owner.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {shop.owner.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                          shop.category
                        )}`}
                      >
                        {shop.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {shop.rating > 0 ? shop.rating.toFixed(1) : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shop.totalProducts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatSales(shop.totalSales)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            shop.status
                          )}`}
                        >
                          {getStatusText(shop.status)}
                        </span>
                        <div className="flex items-center gap-1">
                          {shop.verified ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-xs text-gray-500">
                            {shop.verified ? "Đã xác thực" : "Chưa xác thực"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50">
                          <TrendingUp className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">1</span> đến{" "}
            <span className="font-medium">{filteredShops.length}</span> trong
            tổng số <span className="font-medium">{shops.length}</span> cửa hàng
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Trước
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
