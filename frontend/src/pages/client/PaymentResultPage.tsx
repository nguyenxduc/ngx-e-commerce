import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import apiClient from "../../api/client";

const PaymentResultPage: React.FC = () => {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    const id = params.get("id");
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/payments/${id}`);
        setAmount(data.payment?.amount ?? null);
      } catch (e: any) {
        setError(
          e?.response?.data?.message || "Không tải được thông tin thanh toán"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params]);

  const status = params.get("status");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {loading && <div>Đang tải...</div>}
        {error && <div className="alert alert-error text-sm mb-4">{error}</div>}
        <h1 className="text-2xl font-semibold mb-4">Kết quả thanh toán</h1>
        {status === "success" ? (
          <div className="text-green-600 mb-2">Thanh toán thành công!</div>
        ) : (
          <div className="text-red-600 mb-2">Thanh toán thất bại.</div>
        )}
        {amount !== null && (
          <div className="text-gray-700 mb-6">
            Số tiền: ${amount.toFixed(2)}
          </div>
        )}
        <Link to="/profile" className="btn btn-primary">
          Về trang cá nhân
        </Link>
      </div>
    </div>
  );
};

export default PaymentResultPage;
