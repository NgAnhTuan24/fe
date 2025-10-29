import React, { useEffect, useState, useContext } from "react";
import { Package, Clock, CheckCircle, XCircle, Eye, Truck } from "lucide-react";
import { getOrders, updateOrderStatus } from "../../services/api/OrderApi";
import { AuthContext } from "../../context/AuthContext";
import { formatPrice } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import "../../styles/user/OrdersPage.css";

export default function OrdersPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      // Nếu API trả về tất cả đơn hàng của mọi user,
      // lọc theo userId để chỉ hiển thị đơn của người đang đăng nhập
      const userOrders = res.data.filter((o) => o.user?.id === user.id);
      setOrders(userOrders);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi tải đơn hàng:", err);
      setError("Không thể tải đơn hàng");
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này không?")) return;

    try {
      // Gọi API backend để đổi trạng thái
      await updateOrderStatus(orderId, "CANCELLED");

      // Cập nhật lại UI (có thể reload danh sách hoặc chỉ cập nhật local)
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "CANCELLED" } : o))
      );

      alert("Đơn hàng đã được hủy thành công!");
    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err);
      alert("Không thể hủy đơn hàng. Vui lòng thử lại.");
    }
  };

  const getStatusInfo = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "pending":
        return { text: "Chờ xác nhận", color: "status-pending", icon: Clock };
      case "confirmed":
        return {
          text: "Đã xác nhận",
          color: "status-confirmed",
          icon: CheckCircle,
        };
      case "shipping":
        return {
          text: "Đang giao hàng",
          color: "status-shipping",
          icon: Truck,
        };
      case "completed":
        return {
          text: "Hoàn thành",
          color: "status-completed",
          icon: CheckCircle,
        };
      case "cancelled":
        return { text: "Đã hủy", color: "status-cancelled", icon: XCircle };
      default:
        return {
          text: "Không xác định",
          color: "status-default",
          icon: Package,
        };
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng";
      // case "bank_transfer":
      //   return "Chuyển khoản ngân hàng";
      // case "e_wallet":
      //   return "Ví điện tử";
      case "online_payment":
        return "Thanh toán trực tuyến";
      default:
        return method || "Không rõ";
    }
  };

  const getShippingMethodText = (method) => {
    switch (method) {
      case "home_delivery":
        return "Giao hàng tận nhà";
      case "store_pickup":
        return "Nhận tại cửa hàng";
      // case "long_distance":
      //   return "Vận chuyển đường xa";
      default:
        return method || "Không rõ";
    }
  };

  const getShippingFee = (method) => {
    switch (method) {
      case "home_delivery":
        return 200000;
      case "store_pickup":
        return 0;
      default:
        return 0;
    }
  };

  const filteredOrders = !selectedStatus
    ? orders
    : orders.filter(
        (o) => o.status?.toLowerCase() === selectedStatus.toLowerCase()
      );

  if (!user) {
    return (
      <div className="orders-page min-h-screen center">
        <div className="text-center">
          <h2>Vui lòng đăng nhập</h2>
          <button onClick={() => navigate("/login")}>Đăng nhập</button>
        </div>
      </div>
    );
  }

  if (loading)
    return (
      <div className="orders-page center">
        <h2>Đang tải đơn hàng...</h2>
      </div>
    );

  if (error)
    return (
      <div className="orders-page center">
        <h2>{error}</h2>
      </div>
    );

  // --- Hiển thị chi tiết đơn hàng ---
  if (showOrderDetail && selectedOrder) {
    const statusInfo = getStatusInfo(selectedOrder.status);
    const StatusIcon = statusInfo.icon;

    return (
      <div className="orders-page">
        <div className="container">
          <button
            className="back-btn"
            onClick={() => setShowOrderDetail(false)}
          >
            ← Quay lại danh sách
          </button>

          <div className="order-detail">
            <div className="header">
              <h1>Chi tiết đơn hàng #{selectedOrder.orderCode}</h1>
              <div className={`status-badge ${statusInfo.color}`}>
                <StatusIcon className="icon" /> {statusInfo.text}
              </div>
            </div>

            <div className="grid">
              <div className="order-info">
                <h3>Thông tin đơn hàng</h3>
                <p>Mã đơn: {selectedOrder.orderCode}</p>
                <p>
                  Ngày đặt:{" "}
                  {new Date(selectedOrder.orderDate).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
                <p>
                  Phương thức vận chuyển:{" "}
                  {getShippingMethodText(selectedOrder.shippingMethod)}
                </p>
                <p>
                  Phương thức thanh toán:{" "}
                  {getPaymentMethodText(selectedOrder.paymentMethod)}
                </p>

                <p>
                  Phí vận chuyển:{" "}
                  {formatPrice(getShippingFee(selectedOrder.shippingMethod))}
                </p>
              </div>

              <div className="shipping-info">
                <h3>Thông tin người nhận</h3>
                <p>{selectedOrder.user?.username}</p>
                <p>{selectedOrder.user?.phoneNumber}</p>
                <p>{selectedOrder.user?.address}</p>
              </div>
            </div>

            <div className="order-items">
              <h3>Sản phẩm đã đặt</h3>
              {selectedOrder.orderDetails?.map((detail) => (
                <div className="order-item" key={detail.id}>
                  <img
                    src={detail.cat.imageUrl}
                    alt={detail.cat.catName}
                    className="cat-img"
                  />
                  <div>
                    <h4>{detail.cat.catName}</h4>
                    <p>
                      {detail.cat.breed} •{" "}
                      {detail.cat.gender === "Male" ? "Đực" : "Cái"}
                    </p>
                  </div>
                  <div className="price">{formatPrice(detail.price)}</div>
                </div>
              ))}
            </div>

            <div className="order-total">
              <span>Tổng cộng:</span>
              <span>{formatPrice(selectedOrder.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Hiển thị danh sách đơn ---
  return (
    <div className="orders-page">
      <div className="container">
        <h1>Đơn hàng của tôi</h1>

        <div className="status-filter">
          <button
            className={selectedStatus === "" ? "active" : ""}
            onClick={() => setSelectedStatus("")}
          >
            Tất cả ({orders.length})
          </button>
          {["pending", "confirmed", "shipping", "completed", "cancelled"].map(
            (status) => {
              const info = getStatusInfo(status);
              const count = orders.filter(
                (o) => o.status?.toLowerCase() === status
              ).length;
              return (
                <button
                  key={status}
                  className={selectedStatus === status ? "active" : ""}
                  onClick={() => setSelectedStatus(status)}
                >
                  {info.text} ({count})
                </button>
              );
            }
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-orders">
            <Package className="icon" />
            <h2>Không có đơn hàng nào</h2>
            <p>Bạn chưa có đơn hàng nào trong trạng thái này</p>
            <button onClick={() => navigate("/shop")}>Tiếp tục mua sắm</button>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => {
              const info = getStatusInfo(order.status);
              const StatusIcon = info.icon;
              const firstCat = order.orderDetails?.[0]?.cat;

              return (
                <div className="order-card" key={order.id}>
                  <div className="order-header">
                    <h3>Đơn hàng #{order.orderCode}</h3>
                    <p>
                      Đặt ngày{" "}
                      {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                    </p>
                    <div className={`status-badge ${info.color}`}>
                      <StatusIcon className="icon" /> {info.text}
                    </div>
                  </div>

                  {firstCat && (
                    <div className="order-main">
                      <img
                        src={firstCat.imageUrl}
                        alt={firstCat.catName}
                        className="cat-img"
                      />
                      <div>
                        <h4>{firstCat.catName}</h4>
                        <p>{firstCat.breed}</p>
                        {order.orderDetails.length > 1 && (
                          <p>
                            và {order.orderDetails.length - 1} sản phẩm khác
                          </p>
                        )}
                      </div>
                      <div className="price-info">
                        <p>{formatPrice(order.totalAmount)}</p>
                        <p>{getPaymentMethodText(order.paymentMethod)}</p>
                      </div>
                    </div>
                  )}

                  <button
                    className="view-btn"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowOrderDetail(true);
                    }}
                  >
                    <Eye className="icon" /> Xem chi tiết
                  </button>

                  {/* Nút Hủy đơn hàng */}
                  {["pending"].includes(order.status?.toLowerCase()) && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      <XCircle className="icon" /> Hủy đơn hàng
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
