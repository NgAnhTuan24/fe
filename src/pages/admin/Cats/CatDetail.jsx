import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import {
  translateGender,
  translateStatus,
  calcAge,
} from "../../../utils/helper";
import "../../../styles/admin/Cats/CatDetail.css";
import { getCatById } from "../../../services/api/CatApi";

const CatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    fetchCat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCat = async () => {
    try {
      const res = await getCatById(id);
      setCat(res.data);
      setMainImage(res.data.imageUrl);
    } catch (err) {
      console.error("lỗi kết nối csdl:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!cat) return <div>Không tìm thấy mèo này</div>;

  return (
    <div className="cat-detail-page">
      {/* Header */}
      <div className="cat-detail-header">
        <button className="btn-back-cat" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Quay lại
        </button>
        <h2>Chi tiết mèo: {cat.catName}</h2>
        <button
          className="btn-edit-cat"
          onClick={() => navigate(`/admin/cats/edit/${cat.id}`)}
        >
          <Edit size={16} /> Chỉnh sửa
        </button>
      </div>

      {/* Nội dung chính */}
      <div className="cat-detail-content">
        {/* Ảnh mèo */}
        <div className="cat-images">
          {mainImage && (
            <img src={mainImage} alt={cat.catName} className="main-img" />
          )}
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

        {/* Thông tin cơ bản */}
        <div className="cat-info-container">
          <div className="cat-info">
            <h3>Thông tin cơ bản</h3>
            <div className="info-grid">
              <p>
                <strong>Tên:</strong> {cat.catName}
              </p>
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
              <p>
                <strong>Giá:</strong>{" "}
                <span className="price">
                  {cat.price?.toLocaleString("vi-VN")} VNĐ
                </span>
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span
                  className={`status-cat ${
                    cat.status === "Available" ? "available" : "sold"
                  }`}
                >
                  {translateStatus(cat.status)}
                </span>
              </p>
              <p>
                <strong>Nổi bật:</strong>{" "}
                {cat.featured ? (
                  <span className="featured-text">⭐ Có</span>
                ) : (
                  "Không"
                )}
              </p>
            </div>
          </div>

          {/* Sức khỏe */}
          <div className="cat-health">
            <h3>Sức khỏe</h3>
            <p>{cat.health}</p>
          </div>

          {/* Mô tả */}
          <div className="cat-description">
            <h3>Mô tả</h3>
            <p>{cat.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatDetail;
