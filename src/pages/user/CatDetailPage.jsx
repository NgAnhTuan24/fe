import React, { useState, useEffect, useContext } from "react";
import {
  Shield,
  ArrowLeft,
  MessageCircle,
  Clock,
  ShoppingCart,
  Phone,
} from "lucide-react";
import { translateGender, calcAge } from "../../utils/helper";
import { useNavigate, useParams } from "react-router-dom";
import { getCatById } from "../../services/api/CatApi";
import { AuthContext } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "../../styles/user/CatDetailPage.css";

const CatDetailPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [cat, setCat] = useState(null);

  const [mainImage, setMainImage] = useState("");

  const { user } = useContext(AuthContext);

  const { addToCart } = useCart();

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchCat = async () => {
      try {
        const res = await getCatById(id);
        setCat(res.data);
      } catch (err) {
        console.error("lỗi kết nối csdl:", err);
      }
    };
    fetchCat();
  }, [id]);

  const handleAddToCart = () => {
    if (showAlert) return;

    if (!user) {
      setShowAlert("login");
      setTimeout(() => {
        // navigate("/login");
        setShowAlert(false);
      }, 1500);
      return;
    }

    if (cat.status?.toLowerCase() === "sold") {
      setShowAlert("sold");
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }

    const cartKey = `cart_${user.id}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existingItem = existingCart.find((item) => item.id === cat.id);

    if (existingItem) {
      setShowAlert("exist");
    } else {
      const newItem = {
        id: cat.id,
        name: cat.catName,
        price: cat.price,
        image: cat.imageUrl,
        breed: cat.breed,
      };

      const updatedCart = [...existingCart, newItem];
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));

      addToCart(newItem);
      setShowAlert("added");
    }

    setTimeout(() => setShowAlert(false), 2000);
  };

  if (!cat) return <p>Không có dữ liệu mèo.</p>;

  return (
    <div className="cat-detail-container">
      {/* Nút quay lại */}
      <button
        className="back-button-catdetailpage"
        onClick={() => {
          navigate("/shop");
          window.scrollTo(0, 0);
        }}
      >
        <ArrowLeft size={18} /> Quay lại cửa hàng
      </button>

      {showAlert && (
        <div
          className={`add-alert ${
            showAlert === "added"
              ? "success"
              : showAlert === "sold"
              ? "error"
              : "warning"
          }`}
        >
          {showAlert === "added" && "🐾 Đã thêm vào giỏ hàng!"}
          {showAlert === "exist" && "⚠️ Mèo này đã có trong giỏ hàng!"}
          {showAlert === "login" && "⚠️ Vui lòng đăng nhập để thêm mèo!"}
        </div>
      )}

      <div className="main-content-grid">
        {/* Ảnh mèo */}
        <div className="cat-images">
          <div className="main-img-wrapper">
            <img
              src={mainImage || cat.imageUrl}
              alt={cat.catName}
              className="main-img"
            />
          </div>
          <div className="thumb-list">
            {[cat.imageUrl, ...(cat.imageUrls || [])].map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`cat-${i}`}
                className={`thumb-img ${mainImage === url ? "active" : ""}`}
                onClick={() => setMainImage(url)}
              />
            ))}
          </div>
        </div>

        {/* Thông tin mèo */}
        <div className="cat-info-shopdetail">
          <h1 className="cat-name">{cat.catName}</h1>
          <div className="info-grid-cat">
            <p>
              <strong>Giống:</strong> {cat.breed}
            </p>
            <p>
              <strong>Giới tính:</strong> {translateGender(cat.gender)}
            </p>
            <p>
              <strong>Tuổi:</strong> {calcAge(cat.dateOfBirth)}
            </p>
            <p>
              <strong>Màu lông:</strong> {cat.furColor}
            </p>
            <p>
              <strong>Triệt sản:</strong>{" "}
              {cat.neutered ? "Đã triệt sản" : "Chưa"}
            </p>
          </div>

          <div className="cat-price">
            {cat.price?.toLocaleString("vi-VN")} VNĐ
          </div>

          <div className="cat-health-shopdetail">
            <h2>Tình trạng sức khỏe</h2>
            <p>{cat.health}</p>
          </div>

          <div className="double-btn">
            <button
              className={`btn-cart ${
                cat.status?.toLowerCase() === "sold" ? "disabled" : ""
              }`}
              onClick={handleAddToCart}
              disabled={cat.status?.toLowerCase() === "sold"}
            >
              <ShoppingCart size={18} />
              {cat.status?.toLowerCase() === "sold"
                ? "Hết hàng, vui lòng liên hệ nếu muốn"
                : "Thêm vào giỏ hàng"}
            </button>

            <button
              className="btn-contact"
              onClick={() => {
                navigate("/contact");
                window.scrollTo(0, 0);
              }}
            >
              <Phone size={18} />
              Liên hệ
            </button>
          </div>
        </div>

        {/* Mô tả */}
        <div className="cat-description-shopdetail">
          <h2>Mô tả chi tiết</h2>
          <p>{cat.description}</p>
        </div>
      </div>

      {/* Cam kết / Tính năng */}
      <div className="features-container">
        <div className="feature-item">
          <Shield size={40} className="feature-icon1" />
          <h4 className="feature-title">Bảo hành sức khỏe</h4>
          <p className="feature-text">
            Cam kết bảo hành sức khỏe 30 ngày cho tất cả thú cưng
          </p>
        </div>
        <div className="feature-item">
          <MessageCircle size={40} className="feature-icon2" />
          <h4 className="feature-title">Hỗ trợ trọn đời</h4>
          <p className="feature-text">
            Tư vấn chăm sóc và hỗ trợ khách hàng 24/7
          </p>
        </div>
        <div className="feature-item">
          <Clock size={40} className="feature-icon3" />
          <h4 className="feature-title">Giao hàng an toàn</h4>
          <p className="feature-text">
            Dịch vụ giao hàng chuyên nghiệp, đảm bảo an toàn
          </p>
        </div>
      </div>
    </div>
  );
};

export default CatDetailPage;
