import React, { useState, useRef, useEffect, useContext } from "react";
import { Heart, ShoppingCart, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/user/Header.css";

const Header = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const [openUserMenu, setOpenUserMenu] = useState(false);

  const userMenuRef = useRef(null);

  const { totalItems } = useCart();

  const { user, logout } = useContext(AuthContext);

  const navigation = [
    { name: "Trang chủ", path: "/home" },
    { name: "Cửa hàng", path: "/shop" },
    { name: "Liên hệ", path: "/contact" },
  ];

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpenUserMenu(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          {/* Logo */}
          <Link to="/home" className="logo">
            <div className="logo-icon">
              <Heart className="icon" />
            </div>
            <span className="logo-text">CatHouse</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={location.pathname === item.path ? "active" : ""}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="actions">
            <Link to="/cart" className="icon-btn cart-btn">
              <ShoppingCart className="icon" />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </Link>

            {/* User dropdown */}
            <div
              className={`user-menu-wrapper ${openUserMenu ? "open" : ""}`}
              ref={userMenuRef}
            >
              <button
                className="icon-btn user-btn"
                onClick={() => setOpenUserMenu((prev) => !prev)}
              >
                <User className="icon" />
              </button>
              <div className="user-dropdown">
                {user ? (
                  <>
                    <span className="dropdown-item">
                      Hi, {user.role === "Admin" ? "Admin" : user.username}
                    </span>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setOpenUserMenu(false)}
                    >
                      Tài khoản
                    </Link>
                    <Link
                      to="/orders"
                      className="dropdown-item"
                      onClick={() => setOpenUserMenu(false)}
                    >
                      Đơn mua
                    </Link>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="dropdown-item">
                      Đăng nhập
                    </Link>
                    <Link to="/register" className="dropdown-item">
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
