import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Cat, Package, LogOut } from "lucide-react";
import "../../styles/admin/Sidebar.css";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = ({ children }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // xóa user trong context + localStorage
    navigate("/login"); // quay về trang login
  };

  return (
    <div className="admin-layout">
      <div className="sidebar">
        <h2>
          <Cat size={22} /> CatHouse Admin
        </h2>
        <div className="sidebar-divider" />
        <ul>
          <li>
            {/* end để chỉ active khi pathname chính xác là /admin */}
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <LayoutDashboard size={18} /> <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Users size={18} /> <span>Khách hàng</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/cats"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Cat size={18} /> <span>Quản lý mèo</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Package size={18} /> <span>Đơn hàng</span>
            </NavLink>
          </li>
          <li onClick={handleLogout} className="nav-item logout-item">
            <LogOut size={18} /> <span>Đăng xuất</span>
          </li>
        </ul>
      </div>

      <main className="admin-content">{children}</main>
    </div>
  );
};

export default Sidebar;
