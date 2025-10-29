import axios from "axios";

const API_URL = "http://localhost:8080/auth";

// Gửi email khôi phục mật khẩu
export const forgotPassword = async (email) => {
  try {
    const res = await axios.post(`${API_URL}/forgot-password`, { email });
    return res.data;
  } catch (err) {
    throw err.response?.data || "Không thể gửi email khôi phục.";
  }
};

// Đặt lại mật khẩu với token
export const resetPassword = async (token, newPassword) => {
  try {
    const res = await axios.post(`${API_URL}/reset-password`, {
      token,
      newPassword,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || "Không thể đặt lại mật khẩu.";
  }
};
