import React, { useState, useContext, useEffect } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { sendContactMessage } from "../../services/api/ContactApi";
import "../../styles/user/ContactPage.css";

export default function ContactPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.username || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Vui lòng đăng nhập trước khi gửi tin nhắn!");
      return;
    }

    setIsSending(true);

    try {
      await sendContactMessage(formData);
      alert("Tin nhắn của bạn đã được gửi!");
      setFormData({
        name: user?.username || "",
        email: user?.email || "",
        phone: user?.phoneNumber || "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Lỗi khi gửi mail:", error);
      alert(
        error.response?.data || "Không thể gửi tin nhắn. Vui lòng thử lại sau!"
      );
    } finally {
      setIsSending(false);
    }
  };

  if (!user) {
    return (
      <div className="contact-login-required">
        <p> Bạn cần đăng nhập để gửi tin nhắn liên hệ.</p>
        <button
          onClick={() => navigate("/login")}
          className="button button--primaryV2"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="contact-page__container">
        <header className="contact-page__header">
          <h1 className="contact-page__title">Liên hệ với chúng tôi</h1>
          <p className="contact-page__subtitle">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn tìm kiếm người bạn mèo hoàn hảo.
            Hãy liên hệ để được tư vấn tốt nhất!
          </p>
        </header>

        <div className="contact-page__content">
          {/* Contact Info */}
          <div className="contact-info">
            <div className="contact-info__details">
              <h3 className="contact-info__title">Thông tin liên hệ</h3>
              <div className="contact-info__list">
                <div className="contact-info__item">
                  <div className="contact-info__icon-wrapper">
                    <Phone className="contact-info__icon" />
                  </div>
                  <div>
                    <h4 className="contact-info__heading">Điện thoại</h4>
                    <p className="contact-info__text">0328 894 812</p>
                  </div>
                </div>

                <div className="contact-info__item">
                  <div className="contact-info__icon-wrapper">
                    <Mail className="contact-info__icon" />
                  </div>
                  <div>
                    <h4 className="contact-info__heading">Email</h4>
                    <p className="contact-info__text">luckytme2004@gmail.com</p>
                  </div>
                </div>

                <div className="contact-info__item">
                  <div className="contact-info__icon-wrapper">
                    <MapPin className="contact-info__icon" />
                  </div>
                  <div>
                    <h4 className="contact-info__heading">Địa chỉ</h4>
                    <p className="contact-info__text">
                      Đường Nguyễn Văn Cừ, Khu phố An Giải, Phường Đồng Kỵ,
                      Thành phố Từ Sơn
                    </p>
                  </div>
                </div>

                <div className="contact-info__item">
                  <div className="contact-info__icon-wrapper">
                    <Clock className="contact-info__icon" />
                  </div>
                  <div>
                    <h4 className="contact-info__heading">Giờ làm việc</h4>
                    <p className="contact-info__text">
                      Thứ 2 - Thứ 7: 8:00 - 18:00
                    </p>
                    <p className="contact-info__text">Chủ nhật: 9:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <div className="contact-form">
              <h3 className="contact-form__title">
                Gửi tin nhắn cho chúng tôi
              </h3>
              <form onSubmit={handleSubmit} className="contact-form__form">
                <div className="contact-form__row">
                  <div className="contact-form__group">
                    <label className="contact-form__label">Họ và tên *</label>
                    <input
                      className="contact-form__input"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên"
                      required
                      disabled={!!user}
                    />
                  </div>
                  <div className="contact-form__group">
                    <label className="contact-form__label">Email *</label>
                    <input
                      className="contact-form__input"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Nhập email"
                      required
                      disabled={!!user}
                    />
                  </div>
                </div>

                <div className="contact-form__row">
                  <div className="contact-form__group">
                    <label className="contact-form__label">Số điện thoại</label>
                    <input
                      className="contact-form__input"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                      disabled={!!user}
                    />
                  </div>
                  <div className="contact-form__group">
                    <label className="contact-form__label">Chủ đề *</label>
                    <select
                      className="contact-form__select"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="inquiry">Tư vấn chọn mèo</option>
                      <option value="health">Tư vấn sức khỏe</option>
                      <option value="care">Hướng dẫn chăm sóc</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div className="contact-form__group contact-form__group--full">
                  <label className="contact-form__label">
                    Nội dung tin nhắn *
                  </label>
                  <textarea
                    className="contact-form__textarea"
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Nhập nội dung tin nhắn..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="contact-form__submit-button button button--primary"
                >
                  <Send className="button__icon" />{" "}
                  {isSending ? "Đang gửi..." : "Gửi tin nhắn"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
