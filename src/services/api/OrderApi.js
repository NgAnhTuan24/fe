import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/order`;

// 🧾 Lấy tất cả đơn hàng
export const getOrders = () => axios.get(API_URL);

// 🔍 Lấy đơn hàng theo ID
export const getOrderById = (id) => axios.get(`${API_URL}/${id}`);

// 🆕 Tạo đơn hàng nhiều mèo
// userId: ID của người mua
// catIds: [1, 2, 3] -> danh sách mèo trong giỏ
export const createOrder = (orderData) =>
  axios.post(API_URL, orderData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

// 🔄 Cập nhật trạng thái đơn hàng
export const updateOrderStatus = (id, status) =>
  axios.put(`${API_URL}/${id}/status`, null, {
    params: { status },
  });

// ❌ Xóa đơn hàng
// export const deleteOrder = (id) => axios.delete(`${API_URL}/${id}`);

// 🔄 Cập nhật trạng thái đơn hàng theo orderCode
export const updateOrderStatusByCode = (orderCode, status) =>
  axios.put(`${API_URL}/by-code/${orderCode}/status`, null, {
    params: { status },
  });

// 🔍 Lấy đơn hàng theo orderCode
export const getOrderByCode = (orderCode) =>
  axios.get(`${API_URL}/by-code/${orderCode}`);
