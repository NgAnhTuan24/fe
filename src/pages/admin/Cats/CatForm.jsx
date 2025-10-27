import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/admin/Cats/FormCats.css";
import {
  createCat,
  getCatById,
  updateCat,
  uploadImageToCloudinary,
} from "../../../services/api/CatApi";

const CatForm = ({ mode = "add" }) => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [catData, setCatData] = useState({
    catName: "",
    breed: "",
    dateOfBirth: "",
    gender: "",
    price: "",
    status: "Available",
    furColor: "",
    neutered: false,
    featured: false,
    health: "",
    description: "",
    imageUrl: "",
    imageUrls: [],
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchCat = async () => {
        try {
          const res = await getCatById(id);
          setCatData(res.data);
        } catch (err) {
          console.error("lỗi kết nối csdl:", err);
          // alert("Không tìm thấy mèo!");
          navigate("/admin/cats");
        }
      };
      fetchCat();
    }
  }, [mode, id, navigate]);

  // thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCatData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // upload ảnh
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const url = await uploadImageToCloudinary(file);

        setCatData((prev) => {
          if (!prev.imageUrl) {
            return { ...prev, imageUrl: url };
          } else {
            return { ...prev, imageUrls: [...(prev.imageUrls || []), url] };
          }
        });
      }
    } catch (err) {
      console.error(err);
      alert("Upload ảnh thất bại!");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!catData.imageUrl) {
      alert("Vui lòng chọn ít nhất một ảnh!");
      return;
    }
    setLoading(true);

    try {
      const payload = {
        ...catData,
        dateOfBirth: catData.dateOfBirth
          ? `${catData.dateOfBirth.split("T")[0]}T00:00:00`
          : null,
        price: Number(catData.price),
      };

      if (mode === "add") {
        await createCat(payload);
        alert("Thêm mèo thành công!");
      } else {
        await updateCat(id, payload);
        alert("Cập nhật mèo thành công!");
      }

      navigate("/admin/cats");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra, thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (mode === "edit" && !catData.catName && !loading) {
    return <div>Không có dữ liệu để sửa</div>;
  }

  return (
    <div className="add-cat-page">
      <div className="add-cat-header">
        <h2>{mode === "add" ? "Thêm mèo mới" : "Sửa mèo"}</h2>
        <button
          type="button"
          className="btn-cancel"
          onClick={() => navigate("/admin/cats")}
        >
          <X size={16} /> Hủy
        </button>
      </div>

      <form className="add-cat-form" onSubmit={handleSubmit}>
        <div className="form-column">
          <label>
            Tên mèo:
            <input
              type="text"
              name="catName"
              value={catData.catName || ""}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Giống:
            <input
              type="text"
              name="breed"
              value={catData.breed || ""}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Ngày sinh:
            <input
              type="date"
              name="dateOfBirth"
              value={catData.dateOfBirth?.split("T")[0] || ""}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Giới tính:
            <select
              name="gender"
              value={catData.gender || ""}
              onChange={handleChange}
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="Male">Đực</option>
              <option value="Female">Cái</option>
            </select>
          </label>

          <label>
            Giá (VNĐ):
            <input
              type="number"
              name="price"
              value={catData.price || ""}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Trạng thái:
            <select
              name="status"
              value={catData.status || "Available"}
              onChange={handleChange}
            >
              <option value="Available">Có sẵn</option>
              <option value="Sold">Đã bán</option>
            </select>
          </label>

          <label>
            Màu lông:
            <input
              type="text"
              name="furColor"
              value={catData.furColor || ""}
              onChange={handleChange}
            />
          </label>

          <div className="checkbox-container">
            <label className="checkbox-main">
              <input
                type="checkbox"
                name="neutered"
                checked={catData.neutered || false}
                onChange={handleChange}
              />{" "}
              Đã triệt sản
            </label>
          </div>

          <div className="checkbox-container">
            <label className="checkbox-main">
              <input
                type="checkbox"
                name="featured"
                checked={catData.featured || false}
                onChange={handleChange}
              />{" "}
              Mèo nổi bật
            </label>
          </div>

          <label>
            Tình trạng sức khỏe:
            <input
              type="text"
              name="health"
              value={catData.health || ""}
              onChange={handleChange}
            />
          </label>

          <label>
            Mô tả:
            <textarea
              name="description"
              value={catData.description || ""}
              onChange={handleChange}
            />
          </label>

          <label>
            {mode === "add" ? "Hình ảnh:" : "Thêm ảnh mới:"}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </label>

          {/* Preview ảnh chính */}
          {catData.imageUrl && (
            <div className="preview-section">
              <p>Ảnh chính:</p>
              <div className="image-wrapper">
                <img
                  className="preview-main"
                  src={catData.imageUrl}
                  alt="Main"
                />
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() =>
                    setCatData((prev) => ({
                      ...prev,
                      imageUrl: "",
                    }))
                  }
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Preview ảnh phụ */}
          {catData.imageUrls && catData.imageUrls.length > 0 && (
            <div className="preview-section">
              <p>Ảnh phụ:</p>
              <div className="preview-sub-list">
                {catData.imageUrls.map((url, idx) => (
                  <div key={idx} className="image-wrapper">
                    <img className="preview-sub" src={url} alt={`Sub ${idx}`} />
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() =>
                        setCatData((prev) => ({
                          ...prev,
                          imageUrls: prev.imageUrls.filter((u) => u !== url),
                        }))
                      }
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-setup"
            disabled={loading || uploading}
          >
            {loading
              ? mode === "add"
                ? "Đang thêm..."
                : "Đang lưu..."
              : uploading
              ? "Đang upload ảnh..."
              : mode === "add"
              ? "Thêm mèo"
              : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CatForm;
