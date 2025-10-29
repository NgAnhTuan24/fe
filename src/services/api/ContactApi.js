import axios from "axios";

const API_URL = "http://localhost:8080/contact";

export const sendContactMessage = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/send`, data);
    return res.data;
  } catch (err) {
    console.error("Lỗi khi gửi mail:", err);
    throw err.response?.data || "Không thể gửi mail. Vui lòng thử lại.";
  }
};
