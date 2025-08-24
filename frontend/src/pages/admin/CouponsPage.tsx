import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Tag,
  Eye,
  Edit,
  Trash2,
  Percent,
  Calendar,
  Clock,
} from "lucide-react";
import type { AdminCoupon } from "../../types/admin.types";
import { AdminConfirmModal } from "../../components/admin/AdminConfirmModal";
import { AdminCouponModal } from "../../components/admin/AdminCouponModal";
import { useCouponsStore } from "../../stores/admin.store";

export default function AdminCouponsPage() {
  const {
    coupons,
    loading,
    error,
    page,
    total,
    totalPages,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    setSelectedCoupon,
    setFilters,
  } = useCouponsStore();

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCouponLocal, setSelectedCouponLocal] =
    useState<AdminCoupon | null>(null);
  const [actionType, setActionType] = useState<"add" | "edit" | "delete">(
    "add"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      setFilters({ search: searchTerm });
      fetchCoupons({
        page: 1,
        search: searchTerm,
        active: statusFilter !== "all" ? statusFilter === "active" : undefined,
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, setFilters, fetchCoupons]);

  const getStatusColor = (isActive: boolean, expirationDate: string) => {
    const isExpired = new Date(expirationDate) < new Date();
    if (isExpired)
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    return isActive
      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  };

  const getStatusText = (isActive: boolean, expirationDate: string) => {
    const isExpired = new Date(expirationDate) < new Date();
    if (isExpired) return "Hết hạn";
    return isActive ? "Hoạt động" : "Không hoạt động";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const isExpired = (expirationDate: string) => {
    return new Date(expirationDate) < new Date();
  };

  // CRUD Operations
  const handleAddCoupon = () => {
    setActionType("add");
    setSelectedCouponLocal(null);
    setIsCouponModalOpen(true);
  };

  const handleEditCoupon = (coupon: AdminCoupon) => {
    setActionType("edit");
    setSelectedCouponLocal(coupon);
    setSelectedCoupon(coupon);
    setIsCouponModalOpen(true);
  };

  const handleDeleteCoupon = (coupon: AdminCoupon) => {
    setActionType("delete");
    setSelectedCouponLocal(coupon);
    setIsConfirmModalOpen(true);
  };

  const handleSaveCoupon = async (
    couponData: Omit<AdminCoupon, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      if (actionType === "add") {
        await createCoupon(couponData);
      } else if (actionType === "edit" && selectedCouponLocal) {
        await updateCoupon(selectedCouponLocal.id, couponData);
      }
      setIsCouponModalOpen(false);
      setSelectedCouponLocal(null);
      setSelectedCoupon(null);
    } catch (error) {
      console.error("Error saving coupon:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCouponLocal) return;

    try {
      await deleteCoupon(selectedCouponLocal.id);
      setIsConfirmModalOpen(false);
      setSelectedCouponLocal(null);
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            <strong className="font-bold">Lỗi:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Quản lý mã giảm giá
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Quản lý tất cả mã giảm giá trong hệ thống
          </p>
        </div>

        {/* Header Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm mã giảm giá..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddCoupon}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm mã giảm giá
            </button>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Mã giảm giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Giảm giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ngày hết hạn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sử dụng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      Đang tải...
                    </td>
                  </tr>
                ) : coupons.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      Không có mã giảm giá nào
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr
                      key={coupon.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                              {coupon.code}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {coupon.userId
                                ? `User: ${coupon.userId}`
                                : "Tất cả người dùng"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Percent className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {coupon.discountPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span
                            className={`text-sm ${
                              isExpired(coupon.expirationDate)
                                ? "text-red-600 dark:text-red-400"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {formatDate(coupon.expirationDate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {coupon.usageCount || 0}
                            {coupon.maxUsage && ` / ${coupon.maxUsage}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            coupon.isActive,
                            coupon.expirationDate
                          )}`}
                        >
                          {getStatusText(
                            coupon.isActive,
                            coupon.expirationDate
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditCoupon(coupon)}
                            className="text-green-600 hover:text-green-900 dark:hover:text-green-400 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(coupon)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {!loading && coupons.length === 0 && (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không tìm thấy mã giảm giá
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== "all"
                ? "Thử thay đổi bộ lọc tìm kiếm"
                : "Bắt đầu bằng cách thêm mã giảm giá đầu tiên"}
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Hiển thị <span className="font-medium">{(page - 1) * 10 + 1}</span>{" "}
            đến{" "}
            <span className="font-medium">{Math.min(page * 10, total)}</span>{" "}
            trong tổng số <span className="font-medium">{total}</span> mã giảm
            giá
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchCoupons({ page: page - 1 })}
              disabled={page <= 1}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <span className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
              {page}
            </span>
            <button
              onClick={() => fetchCoupons({ page: page + 1 })}
              disabled={page >= totalPages}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AdminCouponModal
        isOpen={isCouponModalOpen}
        onClose={() => {
          setIsCouponModalOpen(false);
          setSelectedCouponLocal(null);
        }}
        onSave={handleSaveCoupon}
        coupon={selectedCouponLocal}
        loading={loading}
      />

      <AdminConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setSelectedCouponLocal(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa mã giảm giá"
        message={`Bạn có chắc chắn muốn xóa mã giảm giá "${selectedCouponLocal?.code}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        loading={loading}
      />
    </div>
  );
}
