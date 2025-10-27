import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderByCode,
  updateOrderStatusByCode,
} from "../../services/api/OrderApi";
import "../../styles/user/PaymentPage.css";

const PaymentPage = () => {
  const { orderCode } = useParams();
  const navigate = useNavigate();

  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  });

  const [errors, setErrors] = useState({
    bankName: false,
    accountNumber: false,
    accountHolder: false,
  });

  const [attemptSubmit, setAttemptSubmit] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderByCode(orderCode);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        alert("Không thể lấy thông tin đơn hàng!");
      }
    };
    fetchOrder();
  }, [orderCode]);

  const handlePaymentResult = async (status) => {
    if (status === "CONFIRMED") {
      setAttemptSubmit(true);

      const newErrors = {
        bankName: bankInfo.bankName.trim() === "",
        accountNumber: bankInfo.accountNumber.trim() === "",
        accountHolder: bankInfo.accountHolder.trim() === "",
      };
      setErrors(newErrors);

      if (Object.values(newErrors).some((e) => e)) {
        alert("Vui lòng nhập đầy đủ thông tin ngân hàng trước khi thanh toán!");
        return;
      }
    }

    try {
      await updateOrderStatusByCode(orderCode, status);
      alert(
        status === "CONFIRMED"
          ? "Thanh toán thành công"
          : "Thanh toán đã bị hủy"
      );
      navigate("/shop");
    } catch (err) {
      console.error(err);
      alert("Lỗi xử lý thanh toán!");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace("₫", "VND");
  };

  return (
    <div className="payment-page">
      <h2>Cổng thanh toán</h2>

      {/* Thông tin Đơn hàng */}
      <div className="order-summary-section">
        <h3>Thông tin đơn hàng</h3>
        <p>
          Mã đơn hàng:{" "}
          <span className="order-code-display">
            {order?.orderCode || "Đang tải..."}
          </span>
        </p>
        <p className="total-amount-display">
          Tổng tiền:{" "}
          <span className="amount-value">
            {order ? formatCurrency(order.totalAmount) : "Đang tải..."}
          </span>
        </p>
      </div>

      {/* Thông tin Thanh toán */}
      <div className="bank-info-section">
        <h3>Thông tin thanh toán</h3>
        <input
          type="text"
          placeholder="Tên ngân hàng"
          value={bankInfo.bankName}
          onChange={(e) => {
            setBankInfo((p) => ({ ...p, bankName: e.target.value }));
            setErrors((p) => ({ ...p, bankName: false }));
          }}
          className={
            errors.bankName || (attemptSubmit && bankInfo.bankName === "")
              ? "input-error"
              : ""
          }
        />

        <input
          type="text"
          placeholder="Số tài khoản"
          value={bankInfo.accountNumber}
          onChange={(e) => {
            setBankInfo((p) => ({ ...p, accountNumber: e.target.value }));
            setErrors((p) => ({ ...p, accountNumber: false }));
          }}
          className={
            errors.accountNumber ||
            (attemptSubmit && bankInfo.accountNumber === "")
              ? "input-error"
              : ""
          }
        />

        <input
          type="text"
          placeholder="Họ tên chủ tài khoản"
          value={bankInfo.accountHolder}
          onChange={(e) => {
            setBankInfo((p) => ({ ...p, accountHolder: e.target.value }));
            setErrors((p) => ({ ...p, accountHolder: false }));
          }}
          className={
            errors.accountHolder ||
            (attemptSubmit && bankInfo.accountHolder === "")
              ? "input-error"
              : ""
          }
        />
      </div>

      {/* Nút Thanh toán / Hủy */}
      <div className="payment-actions">
        <button
          className="success-btn-payment"
          onClick={() => handlePaymentResult("CONFIRMED")}
          disabled={!order}
        >
          Thanh toán
        </button>
        <button
          className="cancel-btn-payment"
          onClick={() => handlePaymentResult("CANCELLED")}
          disabled={!order}
        >
          Hủy thanh toán
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
