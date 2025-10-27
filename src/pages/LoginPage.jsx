import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Heart } from "lucide-react";
import { login as loginAPI } from "../services/api/AuthApi";
import { AuthContext } from "../context/AuthContext";
import { validateLogin } from "../utils/validation";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    // ✅ Kiểm tra lỗi phía client
    const validationErrors = validateLogin({ email, password });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFormMessage({
        type: "error",
        text: "Vui lòng kiểm tra lại thông tin đăng nhập!",
      });
      return;
    }

    setErrors({});
    setFormMessage(null);

    try {
      const res = await loginAPI(email, password);
      login(res.data);

      setFormMessage({
        type: "success",
        text: "🎉 Đăng nhập thành công! Đang chuyển hướng...",
      });

      setTimeout(() => {
        const role = res.data.role; // ví dụ "Admin" hoặc "User"
        if (role === "Admin") {
          // phải đúng chữ in hoa
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1200);
    } catch (err) {
      setFormMessage({
        type: "error",
        text: "Sai email hoặc mật khẩu!",
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <button className="back-button-log" onClick={() => navigate("/")}>
          <ArrowLeft size={20} /> Trang chủ
        </button>

        <div className="login-logo">
          <Heart className="icon-logo" />
        </div>
        <h2 className="login-title">Đăng nhập vào CatHouse</h2>
        <p className="login-caption">
          Hoặc{" "}
          <span onClick={() => navigate("/register")} className="link">
            tạo tài khoản mới
          </span>
        </p>

        {formMessage && (
          <div
            className={`form-message-log ${
              formMessage.type === "success" ? "success" : "error"
            }`}
          >
            {formMessage.text}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          {/* Email */}
          <div className="input-wrapper">
            <Mail className="input-icon" />
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
          </div>
          {errors.email && <p className="error-text-log">{errors.email}</p>}

          {/* Password */}
          <div className="input-wrapper">
            <Lock className="input-icon left" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>
          {errors.password && (
            <p className="error-text-log">{errors.password}</p>
          )}

          <div className="login-options">
            <span className="forgot" onClick={() => navigate("/forgot")}>
              Quên mật khẩu?
            </span>
          </div>

          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
