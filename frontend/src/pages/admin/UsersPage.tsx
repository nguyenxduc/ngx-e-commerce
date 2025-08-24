import { useState, useEffect } from "react";
import {
  Search,
  UserPlus,
  Mail,
  Calendar,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import type { AdminUser } from "../../types/admin.types";
import AdminUserModal from "../../components/admin/AdminUserModal";
import { AdminConfirmModal } from "../../components/admin/AdminConfirmModal";
import { useUsersStore } from "../../stores/admin.store";

export default function AdminUsersPage() {
  const {
    users,
    loading,
    error,
    page,
    total,
    totalPages,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    setSelectedUser,
    setFilters,
  } = useUsersStore();

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedUserLocal, setSelectedUserLocal] = useState<AdminUser | null>(
    null
  );
  const [actionType, setActionType] = useState<"add" | "edit" | "delete">(
    "add"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      setFilters({ search: searchTerm });
      fetchUsers({
        page: 1,
        search: searchTerm,
        role: roleFilter !== "all" ? roleFilter : "",
        status: statusFilter !== "all" ? statusFilter : "",
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, roleFilter, statusFilter, setFilters, fetchUsers]);

  const handleAddUser = () => {
    setActionType("add");
    setSelectedUserLocal(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setActionType("edit");
    setSelectedUserLocal(user);
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (user: AdminUser) => {
    setActionType("delete");
    setSelectedUserLocal(user);
    setIsConfirmModalOpen(true);
  };

  const handleSaveUser = async (
    userData: Omit<AdminUser, "id" | "createdAt" | "lastLogin">
  ) => {
    try {
      if (actionType === "add") {
        await createUser(userData);
      } else if (actionType === "edit" && selectedUserLocal) {
        await updateUser(selectedUserLocal.id, userData);
      }
      setIsUserModalOpen(false);
      setSelectedUserLocal(null);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUserLocal) return;

    try {
      await deleteUser(selectedUserLocal.id);
      setIsConfirmModalOpen(false);
      setSelectedUserLocal(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "seller":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "suspended":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "banned":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
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
            Quản lý người dùng
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Quản lý tất cả người dùng trong hệ thống
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
                  placeholder="Tìm kiếm người dùng..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Role Filter */}
              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="user">Người dùng</option>
                  <option value="seller">Người bán</option>
                  <option value="admin">Admin</option>
                </select>
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
                  <option value="pending">Chờ xử lý</option>
                  <option value="suspended">Tạm khóa</option>
                  <option value="banned">Cấm</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddUser}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Thêm người dùng
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Đăng nhập cuối
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
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      Không có người dùng nào
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.avatar}
                            alt={user.username}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.username}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role === "admin"
                            ? "Admin"
                            : user.role === "seller"
                            ? "Người bán"
                            : "Người dùng"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {user.status === "active"
                            ? "Hoạt động"
                            : user.status === "pending"
                            ? "Chờ xử lý"
                            : user.status === "suspended"
                            ? "Tạm khóa"
                            : "Cấm"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-green-600 hover:text-green-900 dark:hover:text-green-400 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
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

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Hiển thị <span className="font-medium">{(page - 1) * 10 + 1}</span>{" "}
            đến{" "}
            <span className="font-medium">{Math.min(page * 10, total)}</span>{" "}
            trong tổng số <span className="font-medium">{total}</span> người
            dùng
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchUsers({ page: page - 1 })}
              disabled={page <= 1}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <span className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
              {page}
            </span>
            <button
              onClick={() => fetchUsers({ page: page + 1 })}
              disabled={page >= totalPages}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>

        {/* Modals */}
        <AdminUserModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          onSave={handleSaveUser}
          user={selectedUserLocal}
          isLoading={loading}
        />

        <AdminConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Xóa người dùng"
          message={`Bạn có chắc chắn muốn xóa người dùng "${selectedUserLocal?.username}"? Hành động này không thể hoàn tác.`}
          confirmText="Xóa"
          cancelText="Hủy"
          type="danger"
          loading={loading}
        />
      </div>
    </div>
  );
}
