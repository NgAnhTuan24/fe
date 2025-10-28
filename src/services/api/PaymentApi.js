import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/payment`;

// 🔹 Tạo đơn hàng và lấy URL thanh toán online
export const createPayment = (orderRequest) =>
  axios.post(`${API_URL}/create`, orderRequest, {
    headers: { "Content-Type": "application/json" },
  });
