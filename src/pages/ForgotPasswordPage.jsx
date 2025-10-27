// src/pages/ForgotPasswordPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/api/PasswordApi";
import "../styles/ResPass.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await forgotPassword(email);
      setMessage(res);
    } catch (err) {
      setMessage(`❌ ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Khôi phục mật khẩu</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        {message && <p className="message">{message}</p>}
        <input
          type="email"
          placeholder="Nhập email đã đăng ký"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi liên kết"}
        </button>
      </form>

      <button onClick={() => navigate("/login")} className="link-btn">
        Quay lại đăng nhập
      </button>
    </div>
  );
}
