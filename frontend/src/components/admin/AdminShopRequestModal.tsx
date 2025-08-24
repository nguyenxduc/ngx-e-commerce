import React from "react";
import {
  X,
  Store,
  User,
  Phone,
  Mail,
  Globe,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { AdminShopRequest } from "@/types/admin.types";

interface AdminShopRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopRequest: AdminShopRequest | null;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  loading?: boolean;
}

export const AdminShopRequestModal: React.FC<AdminShopRequestModalProps> = ({
  isOpen,
  onClose,
  shopRequest,
  onApprove,
  onReject,
  loading = false,
}) => {
  const [rejectionReason, setRejectionReason] = React.useState("");

  if (!isOpen || !shopRequest) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(shopRequest.id, rejectionReason);
      setRejectionReason("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-base-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-base-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg leading-6 font-medium text-base-content">
                Chi tiết yêu cầu mở shop
              </h3>
              <button
                onClick={onClose}
                className="text-base-content/50 hover:text-base-content transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Shop Information */}
              <div className="space-y-6">
                {/* Shop Basic Info */}
                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-base-content mb-4 flex items-center">
                    <Store className="h-5 w-5 mr-2" />
                    Thông tin shop
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        Tên shop:
                      </label>
                      <p className="text-base-content font-medium">
                        {shopRequest.shopName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        Danh mục:
                      </label>
                      <p className="text-base-content">
                        {shopRequest.category}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        Mô tả:
                      </label>
                      <p className="text-base-content">
                        {shopRequest.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Applicant Information */}
                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-base-content mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Thông tin người đăng ký
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        Họ tên:
                      </label>
                      <p className="text-base-content font-medium">
                        {shopRequest.applicant.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        Email:
                      </label>
                      <p className="text-base-content">
                        {shopRequest.applicant.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-base-content mb-4 flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Thông tin liên hệ
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        Số điện thoại:
                      </label>
                      <p className="text-base-content">
                        {shopRequest.contactInfo.phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        Email:
                      </label>
                      <p className="text-base-content">
                        {shopRequest.contactInfo.email}
                      </p>
                    </div>
                    {shopRequest.contactInfo.website && (
                      <div>
                        <label className="text-sm font-medium text-base-content/70">
                          Website:
                        </label>
                        <p className="text-base-content">
                          {shopRequest.contactInfo.website}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Business Info & Documents */}
              <div className="space-y-6">
                {/* Business Information */}
                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-base-content mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Thông tin kinh doanh
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        Mã số thuế:
                      </label>
                      <p className="text-base-content font-mono">
                        {shopRequest.businessInfo.taxCode}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        Tài khoản ngân hàng:
                      </label>
                      <div className="bg-base-100 rounded p-2 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Ngân hàng:</span>{" "}
                          {shopRequest.businessInfo.bankAccount.bankName}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Số tài khoản:</span>{" "}
                          {shopRequest.businessInfo.bankAccount.accountNumber}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Chủ tài khoản:</span>{" "}
                          {shopRequest.businessInfo.bankAccount.accountHolder}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-base-content mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Tài liệu đính kèm
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        Giấy phép kinh doanh:
                      </label>
                      <a
                        href={shopRequest.documents.businessLicense}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-focus underline"
                      >
                        Xem tài liệu
                      </a>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        CMND/CCCD:
                      </label>
                      <a
                        href={shopRequest.documents.idCard}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-focus underline"
                      >
                        Xem tài liệu
                      </a>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-base-content mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Thông tin thời gian
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        Ngày đăng ký:
                      </label>
                      <p className="text-base-content">
                        {formatDate(shopRequest.createdAt)}
                      </p>
                    </div>
                    {shopRequest.reviewedAt && (
                      <div>
                        <label className="text-sm font-medium text-base-content/70">
                          Ngày duyệt:
                        </label>
                        <p className="text-base-content">
                          {formatDate(shopRequest.reviewedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            {shopRequest.adminNotes && (
              <div className="mt-6 bg-base-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-base-content mb-2">
                  Ghi chú admin:
                </h4>
                <p className="text-base-content">{shopRequest.adminNotes}</p>
              </div>
            )}

            {/* Rejection Reason */}
            {shopRequest.rejectionReason && (
              <div className="mt-6 bg-error/10 rounded-lg p-4 border border-error/20">
                <h4 className="text-lg font-semibold text-error mb-2">
                  Lý do từ chối:
                </h4>
                <p className="text-error">{shopRequest.rejectionReason}</p>
              </div>
            )}

            {/* Actions */}
            {shopRequest.status === "pending" && (
              <div className="mt-6 pt-6 border-t border-base-300">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Rejection Reason Input */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-base-content mb-2">
                      Lý do từ chối (nếu có):
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 text-base-content"
                      placeholder="Nhập lý do từ chối..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => onApprove(shopRequest.id)}
                      disabled={loading}
                      className="px-4 py-2 bg-success text-success-content rounded-lg hover:bg-success-focus transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Duyệt
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={loading}
                      className="px-4 py-2 bg-error text-error-content rounded-lg hover:bg-error-focus transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="h-4 w-4" />
                      Từ chối
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Status Display */}
            <div className="mt-6 pt-6 border-t border-base-300">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-base-content/70">
                  Trạng thái:
                </span>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    shopRequest.status === "approved"
                      ? "bg-success/20 text-success"
                      : shopRequest.status === "rejected"
                      ? "bg-error/20 text-error"
                      : "bg-warning/20 text-warning"
                  }`}
                >
                  {shopRequest.status === "pending"
                    ? "Chờ duyệt"
                    : shopRequest.status === "approved"
                    ? "Đã duyệt"
                    : "Đã từ chối"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
