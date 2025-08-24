import React, { useState, useEffect } from "react";
import { X, Upload, Tag, FileText } from "lucide-react";
import type { AdminCategory } from "../../types/admin.types";

interface AdminCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<AdminCategory, "id" | "createdAt" | "updatedAt">) => void;
  category?: AdminCategory | null;
  loading?: boolean;
}

export const AdminCategoryModal: React.FC<AdminCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
  });

  const isEdit = !!category;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
        image: category.image || "",
        isActive: category.isActive,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        image: "",
        isActive: true,
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }

    onSave({
      name: formData.name,
      description: formData.description,
      image: formData.image,
      isActive: formData.isActive,
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
        <div className="inline-block align-bottom bg-base-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-base-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg leading-6 font-medium text-base-content">
                {isEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
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
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  <Tag className="inline w-4 h-4 mr-1" />
                  Tên danh mục
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                  placeholder="Nhập tên danh mục"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  <FileText className="inline w-4 h-4 mr-1" />
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                  placeholder="Nhập mô tả danh mục"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  <Upload className="inline w-4 h-4 mr-1" />
                  URL hình ảnh
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                  placeholder="https://example.com/image.jpg"
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
                  Danh mục hoạt động
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
                    "Thêm danh mục"
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
