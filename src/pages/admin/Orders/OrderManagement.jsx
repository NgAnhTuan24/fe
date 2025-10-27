import React, { useState, useEffect } from "react";
import { Search, Eye, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../../services/api/OrderApi";
import "../../../styles/admin/Orders/OrderManagement.css";

const OrderManagement = () => {
  const navigate = useNavigate();

  const [ordersData, setOrdersData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Load orders khi component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      console.log(res.data); // backend trả về mảng Order[]
      setOrdersData(res.data || []);
    } catch (err) {
      console.error("Lỗi kết nối CSDL:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleViewDetails = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  // Filter đơn hàng
  const filteredOrders = Array.isArray(ordersData)
    ? ordersData.filter((order) => {
        const search = searchTerm.toLowerCase();
        const matchSearch =
          order.orderCode?.toLowerCase().includes(search) ||
          order.user?.phoneNumber?.toLowerCase().includes(search) ||
          order.user?.username?.toLowerCase().includes(search);

        const matchStatus =
          selectedStatus === "ALL" || order.status === selectedStatus;

        return matchSearch && matchStatus;
      })
    : [];

  const totalOrders = filteredOrders.length;

  const statusMap = {
    PENDING: "Chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    SHIPPING: "Đang giao",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
  };

  return (
    <div className="orders-page-admin">
      <div className="orders-header">
        <h1 className="header-title">Quản lý đơn hàng</h1>
        <div className="order-count">
          <span className="count">{totalOrders}</span> Tổng đơn
        </div>
      </div>
      <hr />

      {/* Search & Filter */}
      <div className="search-filter-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, tên hoặc số điện thoại..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-box">
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="status-select"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="SHIPPING">Đang giao</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
          <ChevronDown className="dropdown-icon" />
        </div>
      </div>

      {/* Table */}
      <table className="orders-table">
        <thead className="table-header">
          <tr>
            <th>STT</th>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>

                {/* Mã đơn */}
                <td>{order.orderCode}</td>

                {/* Khách hàng */}
                <td>
                  <div>{order.user?.username}</div>
                  <div>{order.user?.phoneNumber}</div>
                </td>

                {/* Ngày đặt */}
                <td>
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString("vi-VN")
                    : ""}
                </td>

                {/* Tổng tiền */}
                <td>{order.totalAmount?.toLocaleString()} VND</td>

                {/* Trạng thái */}
                <td>{statusMap[order.status]}</td>

                {/* Hành động */}
                <td>
                  <button
                    className="action-button"
                    onClick={() => handleViewDetails(order.id)}
                    title="Xem thông tin đơn hàng"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                Không tìm thấy đơn hàng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
