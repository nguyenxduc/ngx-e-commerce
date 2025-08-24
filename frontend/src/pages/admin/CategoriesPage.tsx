import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Tag,
  Eye,
  Edit,
  Trash2,
  Image,
  Calendar,
} from "lucide-react";
import type { AdminCategory } from "../../types/admin.types";
import { AdminConfirmModal } from "../../components/admin/AdminConfirmModal";
import { AdminCategoryModal } from "../../components/admin/AdminCategoryModal";
import { useCategoriesStore } from "../../stores/admin.store";

export default function AdminCategoriesPage() {
  const {
    categories,
    loading,
    error,
    page,
    total,
    totalPages,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    setSelectedCategory,
    setFilters,
  } = useCategoriesStore();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCategoryLocal, setSelectedCategoryLocal] = useState<AdminCategory | null>(null);
  const [actionType, setActionType] = useState<"add" | "edit" | "delete">("add");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      setFilters({ search: searchTerm });
      fetchCategories({ 
        page: 1, 
        search: searchTerm, 
        active: statusFilter !== "all" ? statusFilter === "active" : undefined 
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, setFilters, fetchCategories]);

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // CRUD Operations
  const handleAddCategory = () => {
    setActionType("add");
    setSelectedCategoryLocal(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: AdminCategory) => {
    setActionType("edit");
    setSelectedCategoryLocal(category);
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (category: AdminCategory) => {
    setActionType("delete");
    setSelectedCategoryLocal(category);
    setIsConfirmModalOpen(true);
  };

  const handleSaveCategory = async (categoryData: Omit<AdminCategory, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (actionType === "add") {
        await createCategory(categoryData);
      } else if (actionType === "edit" && selectedCategoryLocal) {
        await updateCategory(selectedCategoryLocal.id, categoryData);
      }
      setIsCategoryModalOpen(false);
      setSelectedCategoryLocal(null);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategoryLocal) return;
    
    try {
      await deleteCategory(selectedCategoryLocal.id);
      setIsConfirmModalOpen(false);
      setSelectedCategoryLocal(null);
    } catch (error) {
      console.error("Error deleting category:", error);
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
            Quản lý danh mục
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Quản lý tất cả danh mục sản phẩm trong hệ thống
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
                  placeholder="Tìm kiếm danh mục..."
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
              onClick={handleAddCategory}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm danh mục
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))
          ) : categories.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Không tìm thấy danh mục nào
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter !== "all"
                  ? "Thử thay đổi bộ lọc tìm kiếm"
                  : "Bắt đầu bằng cách thêm danh mục đầu tiên"}
              </p>
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                {/* Category Image */}
                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Image className="h-8 w-8 text-gray-400" />
                  )}
                </div>

                {/* Category Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {category.description || "Không có mô tả"}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      category.isActive
                    )}`}
                  >
                    {category.isActive ? "Hoạt động" : "Không hoạt động"}
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="inline w-3 h-3 mr-1" />
                    {formatDate(category.createdAt)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="flex-1 text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="flex-1 text-green-600 hover:text-green-900 dark:hover:text-green-400 p-2 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="flex-1 text-red-600 hover:text-red-900 dark:hover:text-red-400 p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && categories.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Hiển thị <span className="font-medium">{((page - 1) * 10) + 1}</span> đến{" "}
              <span className="font-medium">{Math.min(page * 10, total)}</span> trong
              tổng số <span className="font-medium">{total}</span> danh mục
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => fetchCategories({ page: page - 1 })}
                disabled={page <= 1}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <span className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
                {page}
              </span>
              <button 
                onClick={() => fetchCategories({ page: page + 1 })}
                disabled={page >= totalPages}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AdminCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setSelectedCategoryLocal(null);
        }}
        onSave={handleSaveCategory}
        category={selectedCategoryLocal}
        loading={loading}
      />

      <AdminConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setSelectedCategoryLocal(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xóa danh mục"
        message={`Bạn có chắc chắn muốn xóa danh mục "${selectedCategoryLocal?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        loading={loading}
      />
    </div>
  );
}
