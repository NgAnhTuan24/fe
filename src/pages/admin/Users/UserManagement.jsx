import React, { useState, useEffect } from "react";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsersPaged } from "../../../services/api/UserApi";
import "../../../styles/admin/Users/UserManagement.css";

const UserManagement = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async (page = 0, keyword = "") => {
    try {
      const data = await getUsersPaged(page, 5, keyword);
      setUsers(data.users);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalUsers(data.totalElements);
    } catch (err) {
      console.error("Lỗi kết nối CSDL:", err);
    }
  };

  // Khi searchTerm thay đổi, reset về trang đầu
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  // Fetch dữ liệu khi trang hoặc searchTerm thay đổi
  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  return (
    <div className="users-page">
      <div className="users-header">
        <h1>Quản lý khách hàng</h1>
        <div className="user-count">
          <span className="count">{totalUsers}</span> Khách hàng
        </div>
      </div>
      <hr />

      <div className="search-box full">
        <Search size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email, số điện thoại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1 + currentPage * 5}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.address}</td>
                <td>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
                <td className="actions">
                  <button
                    className="btn-view"
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                  >
                    <Eye className="icon-eye" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Không tìm thấy khách hàng nào</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          <ChevronLeft size={18} /> Trước
        </button>
        <span>
          Trang {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))
          }
          disabled={currentPage >= totalPages - 1}
        >
          Sau <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
