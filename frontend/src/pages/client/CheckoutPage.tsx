import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

const CheckoutPage: React.FC = () => {
  const [method, setMethod] = useState<string>("cash_on_delivery");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      setSubmitting(true);
      setError("");
      // In real app, you would create order first and get orderId
      const dummyOrderId = localStorage.getItem("lastOrderId");
      if (!dummyOrderId) {
        setError("Không tìm thấy đơn hàng để thanh toán");
        return;
      }
      const { data } = await apiClient.post("/payments", {
        orderId: dummyOrderId,
        method,
        amount: Number(localStorage.getItem("lastOrderTotal") || 0),
        currency: "USD",
      });
      // simulate redirect to result
      setTimeout(() => {
        navigate(`/payment/result?id=${data.payment._id}&status=success`);
      }, 1000);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Thanh toán thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Thanh toán
        </h1>
        {error && <div className="alert alert-error text-sm mb-4">{error}</div>}
        <div className="bg-white rounded-lg shadow border p-6 space-y-4">
          <div>
            <label className="font-medium">Phương thức thanh toán</label>
            <select
              className="select select-bordered w-full mt-2"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="cash_on_delivery">Thanh toán khi nhận hàng</option>
              <option value="credit_card">Thẻ tín dụng</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Chuyển khoản</option>
            </select>
          </div>
          <button
            className="btn btn-primary"
            disabled={submitting}
            onClick={submit}
          >
            {submitting ? "Đang xử lý..." : "Thanh toán"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
