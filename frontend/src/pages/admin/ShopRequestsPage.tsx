import React, { useEffect, useState } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Store,
  User,
  Calendar,
  Filter,
} from "lucide-react";
import type { AdminShopRequest } from "../../types/admin.types";
import { AdminShopRequestModal } from "../../components/admin/AdminShopRequestModal";
import { AdminConfirmModal } from "../../components/admin/AdminConfirmModal";

const AdminShopRequestsPage: React.FC = () => {
  const [shopRequests, setShopRequests] = useState<AdminShopRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<AdminShopRequest[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal states
  const [selectedRequest, setSelectedRequest] =
    useState<AdminShopRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "reject";
    requestId: string;
    reason?: string;
  } | null>(null);

  useEffect(() => {
    loadShopRequests();
  }, []);

  useEffect(() => {
    let filtered = shopRequests;

    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.applicant.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.applicant.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [shopRequests, searchTerm, statusFilter]);

  const loadShopRequests = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockRequests: AdminShopRequest[] = [
        {
          id: "1",
          shopName: "TechStore Pro",
          description: "Cửa hàng chuyên bán các sản phẩm công nghệ cao cấp",
          category: "Electronics",
          applicant: {
            id: "user1",
            name: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
          },
          contactInfo: {
            phone: "0123456789",
            email: "contact@techstore.com",
            website: "https://techstore.com",
          },
          businessInfo: {
            taxCode: "0123456789",
            bankAccount: {
              accountNumber: "1234567890",
              bankName: "Vietcombank",
              accountHolder: "Nguyễn Văn A",
            },
          },
          documents: {
            businessLicense: "https://example.com/license1.pdf",
            idCard: "https://example.com/idcard1.pdf",
          },
          status: "pending",
          adminNotes: "",
          rejectionReason: "",
          createdAt: "2024-01-15T10:30:00.000Z",
          updatedAt: "2024-01-15T10:30:00.000Z",
        },
        {
          id: "2",
          shopName: "Fashion Boutique",
          description: "Cửa hàng thời trang nam nữ cao cấp",
          category: "Fashion",
          applicant: {
            id: "user2",
            name: "Trần Thị B",
            email: "tranthib@example.com",
          },
          contactInfo: {
            phone: "0987654321",
            email: "info@fashionboutique.com",
            website: "https://fashionboutique.com",
          },
          businessInfo: {
            taxCode: "0987654321",
            bankAccount: {
              accountNumber: "0987654321",
              bankName: "BIDV",
              accountHolder: "Trần Thị B",
            },
          },
          documents: {
            businessLicense: "https://example.com/license2.pdf",
            idCard: "https://example.com/idcard2.pdf",
          },
          status: "approved",
          adminNotes: "Đã kiểm tra và phê duyệt",
          rejectionReason: "",
          reviewedAt: "2024-01-16T14:20:00.000Z",
          createdAt: "2024-01-14T09:15:00.000Z",
          updatedAt: "2024-01-16T14:20:00.000Z",
        },
        {
          id: "3",
          shopName: "Home & Garden",
          description: "Cửa hàng đồ gia dụng và trang trí nhà cửa",
          category: "Home & Garden",
          applicant: {
            id: "user3",
            name: "Lê Văn C",
            email: "levanc@example.com",
          },
          contactInfo: {
            phone: "0369852147",
            email: "sales@homegarden.com",
            website: "",
          },
          businessInfo: {
            taxCode: "0369852147",
            bankAccount: {
              accountNumber: "0369852147",
              bankName: "Agribank",
              accountHolder: "Lê Văn C",
            },
          },
          documents: {
            businessLicense: "https://example.com/license3.pdf",
            idCard: "https://example.com/idcard3.pdf",
          },
          status: "rejected",
          adminNotes: "",
          rejectionReason:
            "Tài liệu không đầy đủ, cần bổ sung giấy phép kinh doanh",
          reviewedAt: "2024-01-17T11:45:00.000Z",
          createdAt: "2024-01-13T16:30:00.000Z",
          updatedAt: "2024-01-17T11:45:00.000Z",
        },
      ];
      setShopRequests(mockRequests);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load shop requests");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request: AdminShopRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleApprove = (requestId: string) => {
    setConfirmAction({ type: "approve", requestId });
    setIsConfirmModalOpen(true);
  };

  const handleReject = (requestId: string, reason: string) => {
    setConfirmAction({ type: "reject", requestId, reason });
    setIsConfirmModalOpen(true);
  };

  const confirmActionHandler = async () => {
    if (!confirmAction) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (confirmAction.type === "approve") {
        // Update request status to approved
        setShopRequests((prev) =>
          prev.map((req) =>
            req.id === confirmAction.requestId
              ? {
                  ...req,
                  status: "approved",
                  reviewedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : req
          )
        );
      } else {
        // Update request status to rejected
        setShopRequests((prev) =>
          prev.map((req) =>
            req.id === confirmAction.requestId
              ? {
                  ...req,
                  status: "rejected",
                  rejectionReason: confirmAction.reason || "",
                  reviewedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : req
          )
        );
      }

      setIsConfirmModalOpen(false);
      setConfirmAction(null);
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/20 text-warning";
      case "approved":
        return "bg-success/20 text-success";
      case "rejected":
        return "bg-error/20 text-error";
      default:
        return "bg-base-200 text-base-content";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Đã từ chối";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content">
            Quản lý yêu cầu mở shop
          </h1>
          <p className="text-base-content/70 mt-2">
            Duyệt và quản lý các yêu cầu mở shop từ người dùng
          </p>
        </div>

        {/* Header Actions */}
        <div className="bg-base-100 rounded-xl shadow-sm p-6 border border-base-300 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên shop hoặc người đăng ký..."
                  className="w-full pl-10 pr-4 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="rejected">Đã từ chối</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-base-content/70">Đang tải dữ liệu...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {/* Shop Requests Table */}
        {!loading && (
          <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-base-200 border-b border-base-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                      Shop
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                      Người đăng ký
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                      Danh mục
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                      Ngày đăng ký
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-base-100 divide-y divide-base-300">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-base-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Store className="h-5 w-5 text-primary" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-base-content">
                              {request.shopName}
                            </div>
                            <div className="text-sm text-base-content/70 truncate max-w-xs">
                              {request.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-secondary" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-base-content">
                              {request.applicant.name}
                            </div>
                            <div className="text-sm text-base-content/70">
                              {request.applicant.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-base-200 text-base-content">
                          {request.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-base-content/50 mr-1" />
                          <span className="text-sm text-base-content">
                            {formatDate(request.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {getStatusText(request.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(request)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Xem chi tiết"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {request.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(request.id)}
                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                title="Duyệt"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleReject(request.id, "")}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                title="Từ chối"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Store className="h-12 w-12 text-base-content/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-base-content mb-2">
              Không có yêu cầu nào
            </h3>
            <p className="text-base-content/70">
              {searchTerm || statusFilter !== "all"
                ? "Thử thay đổi bộ lọc tìm kiếm"
                : "Hiện tại không có yêu cầu mở shop nào"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredRequests.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-base-content">
              Hiển thị <span className="font-medium">1</span> đến{" "}
              <span className="font-medium">{filteredRequests.length}</span>{" "}
              trong tổng số{" "}
              <span className="font-medium">{shopRequests.length}</span> yêu cầu
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 border border-base-300 rounded-lg text-sm text-base-content hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed">
                Trước
              </button>
              <button className="px-3 py-2 bg-primary text-primary-content rounded-lg text-sm hover:bg-primary-focus">
                1
              </button>
              <button className="px-3 py-2 border border-base-300 rounded-lg text-sm text-base-content hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed">
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AdminShopRequestModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRequest(null);
        }}
        shopRequest={selectedRequest}
        onApprove={handleApprove}
        onReject={handleReject}
        loading={loading}
      />

      <AdminConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setConfirmAction(null);
        }}
        onConfirm={confirmActionHandler}
        title={
          confirmAction?.type === "approve"
            ? "Duyệt yêu cầu"
            : "Từ chối yêu cầu"
        }
        message={
          confirmAction?.type === "approve"
            ? "Bạn có chắc chắn muốn duyệt yêu cầu mở shop này?"
            : "Bạn có chắc chắn muốn từ chối yêu cầu mở shop này?"
        }
        confirmText={confirmAction?.type === "approve" ? "Duyệt" : "Từ chối"}
        cancelText="Hủy"
        type={confirmAction?.type === "approve" ? "info" : "danger"}
        loading={loading}
      />
    </div>
  );
};

export default AdminShopRequestsPage;
