import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  Lock,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import { updateUser, changePassword } from "../../services/api/UserApi";
import "../../styles/user/ProfilePage.css";

export default function ProfilePage() {
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.username || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    address: user?.address || "",
  });

  const [errors, setErrors] = useState({});

  // ==========================
  // VALIDATION
  // ==========================
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim())
      newErrors.fullName = "Họ và tên không được để trống.";
    if (!formData.address.trim())
      newErrors.address = "Địa chỉ không được để trống.";
    return newErrors;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const updateData = {
        username: formData.fullName,
        address: formData.address,
      };
      const updatedUser = await updateUser(user.id, updateData);

      // cập nhật lại user trong AuthContext + localStorage
      login(updatedUser);
      alert("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (err) {
      alert("Lỗi khi cập nhật: " + err.response?.data || err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleOrdersClick = () => {
    navigate("/orders");
  };

  if (!user) {
    return (
      <div className="profile-page">
        Vui lòng đăng nhập để xem hồ sơ cá nhân.
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h2 className="profile-title">Hồ sơ cá nhân</h2>

      {/* INFO */}
      <div className="info-section">
        <InfoRow
          icon={<User size={18} />}
          label="Họ và tên"
          field="fullName"
          value={formData.fullName}
          isEditing={isEditing}
          error={errors.fullName}
          onChange={handleInputChange}
        />

        <InfoRow
          icon={<Mail size={18} />}
          label="Email"
          field="email"
          value={formData.email}
          isEditing={isEditing}
          error={errors.email}
          onChange={handleInputChange}
        />

        <InfoRow
          icon={<Phone size={18} />}
          label="Số điện thoại"
          field="phone"
          value={formData.phone}
          isEditing={isEditing}
          error={errors.phone}
          onChange={handleInputChange}
        />

        <InfoRow
          icon={<MapPin size={18} />}
          label="Địa chỉ"
          field="address"
          value={formData.address}
          isEditing={isEditing}
          error={errors.address}
          onChange={handleInputChange}
        />
      </div>

      {/* ACTIONS */}
      <div className="button-section">
        {isEditing ? (
          <>
            <button className="save-btn" onClick={handleSave}>
              <Save size={16} /> Lưu
            </button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
              <X size={16} /> Hủy
            </button>
          </>
        ) : (
          <>
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <Edit3 size={16} /> Chỉnh sửa
            </button>
            <button
              className="password-btn"
              onClick={() => setIsChangingPassword(true)}
            >
              <Lock size={16} /> Đổi mật khẩu
            </button>
            <button className="orders-btn" onClick={handleOrdersClick}>
              <ShoppingBag size={16} /> Đơn hàng
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={16} /> Đăng xuất
            </button>
          </>
        )}
      </div>

      {isChangingPassword && (
        <ChangePasswordModal
          userId={user.id} // <- quan trọng
          onClose={() => setIsChangingPassword(false)}
        />
      )}
    </div>
  );
}

// =========================
// COMPONENT: InfoRow
// =========================
function InfoRow({ icon, label, field, value, isEditing, error, onChange }) {
  const isReadOnly = field === "email" || field === "phone";

  return (
    <div className="info-row">
      <label>
        {icon} {label}:
      </label>
      {isEditing ? (
        <input
          type="text"
          value={value}
          disabled={isReadOnly}
          className={isReadOnly ? "readonly" : ""}
          onChange={(e) => !isReadOnly && onChange(field, e.target.value)}
        />
      ) : (
        <span>{value}</span>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

// =========================
// COMPONENT: Change Password Modal
// =========================
function ChangePasswordModal({ userId, onClose }) {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!passwords.oldPassword) newErrors.oldPassword = "Nhập mật khẩu cũ.";
    if (!passwords.newPassword) newErrors.newPassword = "Nhập mật khẩu mới.";
    if (passwords.newPassword.length < 6)
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
    if (passwords.newPassword !== passwords.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    try {
      await changePassword(userId, {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      alert("Đổi mật khẩu thành công!");
      onClose();
    } catch (err) {
      alert("Lỗi khi đổi mật khẩu: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>
          <Lock size={20} /> Đổi mật khẩu
        </h3>

        <div className="info-row">
          <label>Mật khẩu cũ:</label>
          <input
            type="password"
            value={passwords.oldPassword}
            onChange={(e) => handleChange("oldPassword", e.target.value)}
          />
          {errors.oldPassword && <p className="error">{errors.oldPassword}</p>}
        </div>

        <div className="info-row">
          <label>Mật khẩu mới:</label>
          <input
            type="password"
            value={passwords.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
          />
          {errors.newPassword && <p className="error">{errors.newPassword}</p>}
        </div>

        <div className="info-row">
          <label>Xác nhận mật khẩu:</label>
          <input
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="modal-buttons">
          <button className="save-btn" onClick={handleSubmit}>
            <Save size={14} /> Lưu
          </button>
          <button className="cancel-btn" onClick={onClose}>
            <X size={14} /> Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
