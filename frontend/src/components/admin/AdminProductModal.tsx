import React, { useState, useEffect } from "react";
import { X, Upload, Tag, DollarSign, Package, Store } from "lucide-react";
import type { AdminProduct } from "@/types/admin.types";

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Partial<AdminProduct>) => void;
  product?: AdminProduct | null;
  loading?: boolean;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    status: "active",
    featured: false,
    shopId: "",
  });

  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category,
        status: product.status,
        featured: product.featured,
        shopId: product.shop.id,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        stock: "",
        category: "",
        status: "active",
        featured: false,
        shopId: "",
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
        <div className="inline-block align-bottom bg-base-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-base-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg leading-6 font-medium text-base-content">
                {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
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
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  <Tag className="inline w-4 h-4 mr-1" />
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Giá (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    <Package className="inline w-4 h-4 mr-1" />
                    Tồn kho
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Category and Shop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Danh mục
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home">Home & Garden</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    <Store className="inline w-4 h-4 mr-1" />
                    Cửa hàng
                  </label>
                  <select
                    required
                    value={formData.shopId}
                    onChange={(e) =>
                      handleInputChange("shopId", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                  >
                    <option value="">Chọn cửa hàng</option>
                    <option value="1">TechStore</option>
                    <option value="2">HealthGear</option>
                    <option value="3">MobileWorld</option>
                  </select>
                </div>
              </div>

              {/* Status and Featured */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="out_of_stock">Hết hàng</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      handleInputChange("featured", e.target.checked)
                    }
                    className="h-4 w-4 text-primary focus:ring-primary border-base-300 rounded"
                  />
                  <label
                    htmlFor="featured"
                    className="ml-2 block text-sm text-base-content"
                  >
                    Sản phẩm nổi bật
                  </label>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  <Upload className="inline w-4 h-4 mr-1" />
                  Hình ảnh sản phẩm
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-base-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-base-content/50" />
                    <div className="flex text-sm text-base-content/70">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-base-100 rounded-md font-medium text-primary hover:text-primary-focus focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                      >
                        <span>Tải lên file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">hoặc kéo thả</p>
                    </div>
                    <p className="text-xs text-base-content/50">
                      PNG, JPG, GIF tối đa 10MB
                    </p>
                  </div>
                </div>
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
                    "Thêm sản phẩm"
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
