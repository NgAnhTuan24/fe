import React, { useEffect, useState } from "react";
import { ArrowRight, Shield, Heart, Truck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { translateGender, calcAge } from "../../utils/helper";
import { getFeaturedCats } from "../../services/api/CatApi";
import "../../styles/user/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredCats, setFeaturedCats] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getFeaturedCats();
        setFeaturedCats(res.data);
      } catch (err) {
        console.error("lỗi kết nối csdl:", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section id="hero" className="hero container">
        <div className="hero-text">
          <h1>
            Tìm người bạn <span>hoàn hảo</span> cho gia đình bạn
          </h1>
          <p>Chúng tôi cung cấp những chú mèo khỏe mạnh, đáng yêu</p>
          <div className="hero-buttons">
            <button
              className="primary"
              onClick={() => {
                navigate("/shop");
                window.scrollTo(0, 0);
              }}
            >
              Xem cửa hàng <ArrowRight />
            </button>
            <button
              className="secondary"
              onClick={() => {
                navigate("/contact");
                window.scrollTo(0, 0);
              }}
            >
              Tư vấn ngay
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://images.pexels.com/photos/1276553/pexels-photo-1276553.jpeg"
            alt="Cute cats"
          />
        </div>
      </section>

      {/* Features */}
      <div id="features">
        <section className="section-title-homepage">
          <h2>Tại sao chọn CatHouse?</h2>
          <p>Chúng tôi cam kết mang đến trải nghiệm tuyệt vời nhất</p>
        </section>
        <section className="features container">
          <div className="feature-card">
            <Shield />
            <h3>Bảo hành sức khỏe</h3>
            <p>Cam kết bảo hành sức khỏe 30 ngày cho tất cả chú mèo</p>
          </div>
          <div className="feature-card">
            <Heart />
            <h3>Chăm sóc tận tình</h3>
            <p>Hỗ trợ tư vấn chăm sóc trọn đời cho chú mèo của bạn</p>
          </div>
          <div className="feature-card">
            <Truck />
            <h3>Giao hàng an toàn</h3>
            <p>Dịch vụ giao hàng chuyên nghiệp, đảm bảo an toàn</p>
          </div>
          <div className="feature-card">
            <Users />
            <h3>Cộng đồng yêu mèo</h3>
            <p>Tham gia cộng đồng yêu mèo nhiệt tình và thân thiện</p>
          </div>
        </section>
      </div>

      {/* Featured Cats */}
      <div id="cats">
        <section className="section-title-homepage">
          <h2>Mèo nổi bật</h2>
          <p>Những chú mèo đáng yêu đang chờ đón gia đình mới</p>
        </section>
        <section className="cats-grid container">
          {featuredCats.length > 0 ? (
            featuredCats.map((cat) => (
              <div key={cat.id} className="cat-card-home">
                <img src={cat.imageUrl} alt={cat.catName} />
                <h4>{cat.catName}</h4>
                <p>
                  {cat.breed} - {translateGender(cat.gender)} -{" "}
                  {calcAge(cat.dateOfBirth)} tuổi, Màu {cat.furColor}
                </p>
                <p>{cat.price.toLocaleString()} VND</p>
                <button
                  className="cat-detail-btn"
                  onClick={() => navigate(`/shop/${cat.id}`)}
                >
                  Xem chi tiết
                </button>
              </div>
            ))
          ) : (
            <p>Chưa có mèo nổi bật nào</p>
          )}
        </section>
      </div>

      {/* CTA */}
      <section className="cta">
        <h2>Sẵn sàng tìm người bạn mới?</h2>
        <p>Hãy để chúng tôi giúp bạn tìm được chú mèo hoàn hảo</p>
        <button
          onClick={() => {
            navigate("/contact");
            window.scrollTo(0, 0);
          }}
        >
          Liên hệ ngay
        </button>
      </section>
    </div>
  );
}
