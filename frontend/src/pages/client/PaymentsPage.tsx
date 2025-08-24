import React, { useEffect, useState } from "react";
import apiClient from "../../api/client";

interface PaymentItem {
  _id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
}

const PaymentsPage: React.FC = () => {
  const [items, setItems] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/payments/user");
        setItems(data.payments || []);
      } catch (e: any) {
        setError(
          e?.response?.data?.message || "Không tải được danh sách thanh toán"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Lịch sử thanh toán
        </h1>
        {loading && <div>Đang tải...</div>}
        {error && <div className="alert alert-error text-sm mb-4">{error}</div>}
        <div className="bg-white rounded-lg shadow border overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Số tiền</th>
                <th>Phương thức</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p._id}>
                  <td>{new Date(p.createdAt).toLocaleString()}</td>
                  <td>${p.amount.toFixed(2)}</td>
                  <td>{p.method}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
              {items.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center text-sm text-gray-600"
                  >
                    Không có thanh toán nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
