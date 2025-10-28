import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/contact`;

export const sendContactMessage = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/send`, data);
    return res.data;
  } catch (err) {
    console.error("Lỗi khi gửi mail:", err);
    throw err.response?.data || "Không thể gửi mail. Vui lòng thử lại.";
  }
};
