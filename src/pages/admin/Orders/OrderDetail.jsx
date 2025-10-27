import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { translateGender, calcAge } from "../../../utils/helper";
import {
  getOrderById,
  updateOrderStatus,
} from "../../../services/api/OrderApi";
import "../../../styles/admin/Orders/OrderDetail.css";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchOrderDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      const res = await getOrderById(id);
      setOrder(res.data);
      setStatus(res.data.status);
    } catch (err) {
      console.error("Lỗi kết nối csdl:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      setStatus(newStatus); // cập nhật UI ngay
      alert("Cập nhật trạng thái thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!order) return <div>Không tìm thấy đơn hàng này</div>;

  const statusMap = {
    PENDING: "Chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    SHIPPING: "Đang giao",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
  };

  const shippingMethodMap = {
    home_delivery: "Giao hàng tận nhà",
    store_pickup: "Nhận tại cửa hàng",
    // long_distance: "Vận chuyển đường xa",
  };

  const paymentMethodMap = {
    cod: "Thanh toán khi nhận hàng (COD)",
    // bank_transfer: "Chuyển khoản ngân hàng",
    // e_wallet: "Ví điện tử",
    online_payment: "Thanh toán trực tuyến",
  };

  return (
    <div className="order-detail-page">
      {/* --- Header --- */}
      <div className="order-detail-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft className="w-5 h-5" /> Quay lại
        </button>
        <h1>Chi tiết đơn hàng: {order.orderCode}</h1>
      </div>
      <hr />

      {/* --- Thông tin đơn hàng --- */}
      <section className="detail-section">
        <h2>Thông tin đơn hàng</h2>
        <div className="detail-row">
          <span className="label">Mã đơn:</span>
          <span>{order.orderCode}</span>
        </div>
        <div className="detail-row">
          <span className="label">Ngày đặt:</span>
          <span>
            {order.orderDate
              ? new Date(order.orderDate).toLocaleDateString("vi-VN")
              : ""}
          </span>
        </div>
        <div className="detail-row">
          <span className="label">Tổng tiền:</span>
          <span>{order.totalAmount?.toLocaleString()} VND</span>
        </div>
        <div className="detail-row">
          <span className="label">Phương thức vận chuyển:</span>
          <span>
            {shippingMethodMap[order.shippingMethod] || "Không có thông tin"}
          </span>
        </div>

        <div className="detail-row">
          <span className="label">Phương thức thanh toán:</span>
          <span>
            {paymentMethodMap[order.paymentMethod] || "Không có thông tin"}
          </span>
        </div>
        <div className="detail-row">
          <span className="label">Trạng thái:</span>
          <div className="status-group">
            {Object.keys(statusMap).map((key) => (
              <button
                key={key}
                className={`status-btn ${status === key ? "active" : ""}`}
                onClick={() => handleStatusUpdate(key)}
              >
                {statusMap[key]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- Thông tin khách hàng --- */}
      <section className="detail-section">
        <h2>Thông tin khách hàng</h2>
        <div className="detail-row">
          <span className="label">Tên:</span>
          <span>{order.user?.username}</span>
        </div>
        <div className="detail-row">
          <span className="label">Email:</span>
          <span>{order.user?.email}</span>
        </div>
        <div className="detail-row">
          <span className="label">Số điện thoại:</span>
          <span>{order.user?.phoneNumber}</span>
        </div>
        <div className="detail-row">
          <span className="label">Địa chỉ:</span>
          <span>{order.user?.address}</span>
        </div>
      </section>

      {/* --- Thông tin mèo --- */}
      <section className="detail-section">
        <h2>Thông tin mèo</h2>
        {order.orderDetails?.map((detail) => {
          const cat = detail.cat;
          return (
            <div key={cat.id} className="pet-info-box">
              <img
                className="pet-detail-image"
                src={cat.imageUrl}
                alt={cat.catName}
              />
              <div className="pet-info">
                <div>
                  <span className="label">Tên mèo:</span> {cat.catName}
                </div>
                <div>
                  <span className="label">Giống:</span> {cat.breed}
                </div>
                <div>
                  <span className="label">Tuổi:</span>{" "}
                  {calcAge(cat.dateOfBirth)}
                </div>
                <div>
                  <span className="label">Giới tính:</span>{" "}
                  {translateGender(cat.gender)}
                </div>
                <div>
                  <span className="label">Giá:</span>{" "}
                  {detail.price.toLocaleString()} VND
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default OrderDetail;
