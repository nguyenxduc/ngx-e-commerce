import React, { useState, useEffect } from "react";
import { X, Tag, Percent, Calendar, User } from "lucide-react";
import type { AdminCoupon } from "../../types/admin.types";

interface AdminCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (coupon: Omit<AdminCoupon, "id" | "createdAt" | "updatedAt">) => void;
  coupon?: AdminCoupon | null;
  loading?: boolean;
}

export const AdminCouponModal: React.FC<AdminCouponModalProps> = ({
  isOpen,
  onClose,
  onSave,
  coupon,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
    expirationDate: "",
    isActive: true,
    userId: "",
    maxUsage: "",
  });

  const isEdit = !!coupon;

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code,
        discountPercentage: coupon.discountPercentage.toString(),
        expirationDate: coupon.expirationDate.split("T")[0], // Convert to date input format
        isActive: coupon.isActive,
        userId: coupon.userId,
        maxUsage: coupon.maxUsage?.toString() || "",
      });
    } else {
      setFormData({
        code: "",
        discountPercentage: "",
        expirationDate: "",
        isActive: true,
        userId: "",
        maxUsage: "",
      });
    }
  }, [coupon]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.code || !formData.discountPercentage || !formData.expirationDate) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    onSave({
      code: formData.code,
      discountPercentage: parseFloat(formData.discountPercentage),
      expirationDate: new Date(formData.expirationDate).toISOString(),
      isActive: formData.isActive,
      userId: formData.userId || "",
      maxUsage: formData.maxUsage ? parseInt(formData.maxUsage) : undefined,
      usageCount: 0, // Default value for new coupons
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handleInputChange("code", result);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-base-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-base-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg leading-6 font-medium text-base-content">
                {isEdit ? "Chỉnh sửa mã giảm giá" : "Thêm mã giảm giá mới"}
              </h3>
              <button
                onClick={onClose}
                className="text-base-content/50 hover:text-base-content transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  <Tag className="inline w-4 h-4 mr-1" />
                  Mã giảm giá
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      handleInputChange("code", e.target.value.toUpperCase())
                    }
                    className="flex-1 px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                    placeholder="Nhập mã giảm giá"
                  />
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="px-3 py-2 bg-secondary text-secondary-content rounded-lg hover:bg-secondary-focus transition-colors"
                  >
                    Tạo mã
                  </button>
                </div>
              </div>

              {/* Discount Percentage */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  <Percent className="inline w-4 h-4 mr-1" />
                  Phần trăm giảm giá (%)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.discountPercentage}
                  onChange={(e) =>
                    handleInputChange("discountPercentage", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                  placeholder="0.00"
                />
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Ngày hết hạn
                </label>
                <input
                  type="date"
                  required
                  value={formData.expirationDate}
                  onChange={(e) =>
                    handleInputChange("expirationDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                />
              </div>

              {/* User ID */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  ID người dùng (để trống cho tất cả)
                </label>
                <input
                  type="text"
                  value={formData.userId}
                  onChange={(e) => handleInputChange("userId", e.target.value)}
                  className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                  placeholder="ID người dùng cụ thể"
                />
              </div>

              {/* Max Usage */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  Số lần sử dụng tối đa (để trống = không giới hạn)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxUsage}
                  onChange={(e) =>
                    handleInputChange("maxUsage", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                  placeholder="Không giới hạn"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.checked)
                  }
                  className="h-4 w-4 text-primary focus:ring-primary border-base-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 block text-sm text-base-content"
                >
                  Mã giảm giá hoạt động
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-base-300">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-base-300 rounded-lg text-sm font-medium text-base-content hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary border border-transparent rounded-lg text-sm font-medium text-primary-content hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-content mr-2"></div>
                      Đang lưu...
                    </div>
                  ) : isEdit ? (
                    "Cập nhật"
                  ) : (
                    "Thêm mã giảm giá"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
