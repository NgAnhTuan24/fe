import React, { useState, useEffect } from "react";
import {
  Eye,
  Edit,
  Trash2,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { translateGender, translateStatus } from "../../../utils/helper";
import "../../../styles/admin/Cats/CatManagement.css";
import { getCatsPaged, deleteCat } from "../../../services/api/CatApi";

const CatManagement = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const [cats, setCats] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  const fetchCats = async () => {
    try {
      const res = await getCatsPaged(currentPage, 5, searchTerm);
      setCats(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Lỗi khi load mèo:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa mèo này?")) {
      try {
        await deleteCat(id);
        fetchCats();
        setCats(cats.filter((c) => c.id !== id)); // Cập nhật UI sau khi xóa
      } catch (err) {
        console.error("Lỗi khi xóa mèo:", err);
      }
    }
  };

  return (
    <div className="cats-page">
      {/* Header */}
      <div className="cats-header">
        <h1>Quản lý mèo</h1>
        <div className="cat-actions">
          <button
            className="btn-add"
            onClick={() => navigate("/admin/cats/add")}
          >
            <Plus size={16} /> Thêm mèo
          </button>
        </div>
      </div>
      <hr />

      {/* Thanh tìm kiếm */}
      <div className="search-box full">
        <Search size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, giống mèo..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
        />
      </div>

      {/* Bảng quản lý mèo */}
      <table className="cats-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Hình ảnh</th>
            <th>Tên mèo</th>
            <th>Giống</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Giá (VNĐ)</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {cats.length > 0 ? (
            cats.map((cat, index) => (
              <tr key={cat.id}>
                {/* <td>{cat.id}</td> */}
                <td>{currentPage * 5 + index + 1}</td>
                <td>
                  <img
                    src={cat.imageUrl}
                    alt={cat.catName}
                    className="cat-thumb"
                  />
                </td>
                <td>{cat.catName}</td>
                <td>{cat.breed}</td>
                <td>
                  {cat.dateOfBirth
                    ? new Date(cat.dateOfBirth).toLocaleDateString("vi-VN")
                    : ""}
                </td>
                <td>{translateGender(cat.gender)}</td>
                <td className="total-amount">
                  {cat.price?.toLocaleString()} VND
                </td>
                <td>
                  <span
                    className={`cat-status ${
                      cat.status === "Available" ? "available" : "sold"
                    }`}
                  >
                    {translateStatus(cat.status)}
                  </span>
                </td>

                <td className="btn-action">
                  <button
                    className="btn-view"
                    onClick={() => navigate(`/admin/cats/${cat.id}`)}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/admin/cats/edit/${cat.id}`)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(cat.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">Không tìm thấy mèo nào</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Điều hướng phân trang */}
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

export default CatManagement;
