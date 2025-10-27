import React from "react";
import { Heart, Phone, Mail, MapPin } from "lucide-react";
import "../../styles/user/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="brand">
              <div className="brand-icon">
                <Heart size={20} color="white" />
              </div>
              <span className="brand-name">CatHouse</span>
            </div>
            <p className="desc">
              Cửa hàng mèo cưng uy tín, chuyên cung cấp những chú mèo thuần
              chủng khỏe mạnh và đáng yêu nhất.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-title">Liên kết nhanh</h3>
            <ul>
              <li>
                <a href="#hero">Về chúng tôi</a>
              </li>
              <li>
                <a href="#features">Chính sách bảo hành</a>
              </li>
              <li>
                <a href="#cats">Mèo nổi bật</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer-title">Liên hệ</h3>
            <div className="contact">
              <div className="contact-id">
                <Phone size={16} color="orange" /> 0328894812
              </div>
              <div className="contact-id">
                <Mail size={16} color="orange" /> Luckytme2004@gmail.com
              </div>
              <div className="contact-id">
                <MapPin size={16} color="orange" /> Đường Nguyễn Văn Cừ, Khu phố
                An Giải, Phường Đồng Kỵ, Thành phố Từ Sơn
              </div>
            </div>
          </div>
        </div>

        <div className="copyright">
          &copy; 2025 CatHouse. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
