import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById } from "../../../services/api/UserApi";
import "../../../styles/admin/Users/UserDetail.css";

const UserDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        setUser(data);
      } catch (err) {
        console.error("lỗi kết nối csdl:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!user) return <div>Không tìm thấy khách hàng này</div>;

  return (
    <div className="user-detail-page">
      <div className="users-detail-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Quay lại
        </button>

        <h2 className="title">Chi tiết khách hàng: {user.username}</h2>
      </div>
      <hr />

      <div className="card info-card">
        <h3>Thông tin cá nhân</h3>
        <div className="info-row-container">
          <div>
            <div className="info-row">
              <span>Họ và tên:</span>
              <span>{user.username}</span>
            </div>
            <div className="info-row">
              <span>Ngày đăng ký:</span>
              <span>
                {new Date(user.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
          <div>
            <div className="info-row">
              <span>
                <Mail size={16} style={{ marginLeft: "4px" }} /> Email:
              </span>
              <span>{user.email}</span>
            </div>
            <div className="info-row">
              <span>
                <Phone size={16} style={{ marginLeft: "4px" }} /> Số điện thoại:
              </span>
              <span>{user.phoneNumber}</span>
            </div>
            <div className="info-row">
              <span>
                <MapPin size={16} style={{ marginLeft: "4px" }} /> Địa chỉ:
              </span>
              <span>{user.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card summary-card">
        <div className="summary-item">
          <div className="label">Tổng đơn hàng</div>
          <div className="value">{user.totalOrders || 0}</div>
        </div>
        <div className="summary-item">
          <div className="label">Trạng thái</div>
          <div>
            <span
              className={`status ${
                user.status === "Active" ? "active" : "inactive"
              }`}
            >
              {user.status === "Active" ? "Hoạt động" : "Không hoạt động"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
