// src/pages/ResetPasswordPage.jsx
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api/PasswordApi";
import "../styles/ResPass.css";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setMessage("Mật khẩu nhập lại không khớp!");
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await resetPassword(token, newPassword);
      setMessage(res);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(`❌ ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Đặt lại mật khẩu</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
