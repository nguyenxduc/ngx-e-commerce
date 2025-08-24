import React, { useEffect, useState } from "react";
import apiClient from "../../api/client";

interface ShopRequestItem {
  _id: string;
  shopName: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: string;
}

const statusClass = (s: ShopRequestItem["status"]) => {
  switch (s) {
    case "approved":
      return "badge-success";
    case "rejected":
      return "badge-error";
    default:
      return "badge-warning";
  }
};

const ShopRequestListPage: React.FC = () => {
  const [items, setItems] = useState<ShopRequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/shop-requests/user");
        setItems(data.shopRequests || []);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load requests");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Yêu cầu mở shop của tôi
        </h1>
        {loading && <div>Đang tải...</div>}
        {error && <div className="alert alert-error text-sm mb-4">{error}</div>}
        <div className="bg-white rounded-lg shadow border">
          <ul className="divide-y">
            {items.map((r) => (
              <li key={r._id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{r.shopName}</p>
                    <p className="text-sm text-gray-600">
                      Gửi lúc {new Date(r.createdAt).toLocaleString()}
                    </p>
                    {r.status === "rejected" && r.rejectionReason && (
                      <p className="text-sm text-red-600 mt-1">
                        Lý do: {r.rejectionReason}
                      </p>
                    )}
                  </div>
                  <span className={`badge ${statusClass(r.status)}`}>
                    {r.status}
                  </span>
                </div>
              </li>
            ))}
            {items.length === 0 && !loading && (
              <li className="p-6 text-center text-sm text-gray-600">
                Chưa có yêu cầu nào.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShopRequestListPage;
