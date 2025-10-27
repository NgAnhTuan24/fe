import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { register } from "../services/api/AuthApi";
import { validateRegister } from "../utils/validation";
import "../styles/RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegister({
      username,
      email,
      password,
      confirmPassword,
      phone,
      address,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFormMessage({
        type: "error",
        text: "Vui lòng kiểm tra lại các trường!",
      });
      return;
    }

    setErrors({});
    setFormMessage(null);

    try {
      const data = { username, email, password, phoneNumber: phone, address };
      await register(data);
      setFormMessage({
        type: "success",
        text: "🎉 Đăng ký thành công! Đang chuyển hướng...",
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setFormMessage({
        type: "error",
        text:
          err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.",
      });
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <button className="back-button-re" onClick={() => navigate("/")}>
          <ArrowLeft size={20} /> Trang chủ
        </button>

        <div className="register-logo">
          <Heart className="icon-logo-re" />
        </div>
        <h2 className="register-title">Tạo tài khoản mới</h2>

        <p className="register-caption">
          Hoặc{" "}
          <span onClick={() => navigate("/login")} className="link">
            đăng nhập nếu đã có tài khoản
          </span>
        </p>

        {formMessage && (
          <div
            className={`form-message ${
              formMessage.type === "success" ? "success" : "error"
            }`}
          >
            {formMessage.text}
          </div>
        )}

        <form onSubmit={handleRegister} className="register-form">
          {/* Username */}
          {errors.username && <p className="error-text">{errors.username}</p>}
          <div className="input-wrapper">
            <User className="input-icon" />
            <input
              type="text"
              placeholder="Nhập tên người dùng"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email */}
          {errors.email && <p className="error-text">{errors.email}</p>}
          <div className="input-wrapper">
            <Mail className="input-icon" />
            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          {errors.password && <p className="error-text">{errors.password}</p>}
          <div className="input-wrapper">
            <Lock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>

          {/* Confirm Password */}
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword}</p>
          )}
          <div className="input-wrapper">
            <Lock className="input-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>

          {/* Phone */}
          {errors.phone && <p className="error-text">{errors.phone}</p>}
          <div className="input-wrapper">
            <Phone className="input-icon" />
            <input
              type="tel"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Address */}
          {errors.address && <p className="error-text">{errors.address}</p>}
          <div className="input-wrapper">
            <MapPin className="input-icon" />
            <input
              type="text"
              placeholder="Nhập địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <button type="submit" className="register-button">
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
}
