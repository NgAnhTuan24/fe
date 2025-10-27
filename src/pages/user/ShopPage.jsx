import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { translateGender, calcAge } from "../../utils/helper";
import { getCats } from "../../services/api/CatApi";
import "../../styles/user/ShopPage.css";

export default function ShopPage() {
  const navigate = useNavigate();

  const [cats, setCats] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedGender, setSelectedGender] = useState("");

  const [selectedAge, setSelectedAge] = useState("");

  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const [sortBy, setSortBy] = useState("name");

  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // Gọi API lấy danh sách mèo
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCats();
        setCats(res.data);
      } catch (err) {
        console.error("lỗi kết nối csdl:", err);
      }
    };
    fetchCats();
  }, []);

  const getAgeInMonths = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    return (
      (today.getFullYear() - birthDate.getFullYear()) * 12 +
      (today.getMonth() - birthDate.getMonth())
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [
    cats,
    searchQuery,
    selectedCategory,
    selectedGender,
    selectedAge,
    priceRange,
    sortBy,
  ]);

  const filteredAndSortedCats = useMemo(() => {
    let filtered = cats.filter((cat) => {
      const matchesSearch =
        (cat.catName &&
          cat.catName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (cat.breed &&
          cat.breed.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        !selectedCategory || cat.breed === selectedCategory;

      const matchesGender =
        !selectedGender ||
        (cat.gender &&
          cat.gender.toLowerCase() === selectedGender.toLowerCase());

      const matchesPrice =
        (!priceRange.min || cat.price >= parseInt(priceRange.min)) &&
        (!priceRange.max || cat.price <= parseInt(priceRange.max));

      const catAge = getAgeInMonths(cat.dateOfBirth);
      let matchesAge = true;
      if (selectedAge === "under-6") matchesAge = catAge < 6;
      else if (selectedAge === "6-12") matchesAge = catAge >= 6 && catAge <= 12;
      else if (selectedAge === "over-12") matchesAge = catAge > 12;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesGender &&
        matchesPrice &&
        matchesAge
      );
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "age":
          return new Date(b.dateOfBirth) - new Date(a.dateOfBirth);
        case "name":
        default:
          return a.catName.localeCompare(b.catName);
      }
    });

    return filtered;
  }, [
    cats,
    searchQuery,
    selectedCategory,
    selectedGender,
    selectedAge,
    priceRange,
    sortBy,
  ]);

  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCats = filteredAndSortedCats.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredAndSortedCats.length / itemsPerPage);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedGender("");
    setSelectedAge("");
    setPriceRange({ min: "", max: "" });
    setSortBy("name");
  };

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      cats.map((cat) => cat.breed).filter(Boolean)
    );
    return Array.from(uniqueCategories);
  }, [cats]);

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>Cửa hàng mèo cưng</h1>
        <p>Tìm kiếm và chọn lựa chú mèo hoàn hảo cho gia đình bạn</p>
      </div>

      {/* Search & Filter */}
      <div className="shop-filters-box">
        <div className="shop-search">
          <div className="search-input">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên mèo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-filter"
          >
            <Filter className="btn-icon" />
            Bộ lọc
          </button>
        </div>

        {showFilters && (
          <div className="filters-grid">
            {/* Category */}
            <div className="filter-group">
              <label>Giống mèo</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Tất cả</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender */}
            <div className="filter-group">
              <label>Giới tính</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="male">Đực</option>
                <option value="female">Cái</option>
              </select>
            </div>

            {/* Age */}
            <div className="filter-group">
              <label>Tuổi</label>
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="under-6">Dưới 6 tháng</option>
                <option value="6-12">6 - 12 tháng</option>
                <option value="over-12">Trên 1 năm</option>
              </select>
            </div>

            {/* Price */}
            <div className="filter-group">
              <label>Giá (VNĐ)</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Từ"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                />
                <input
                  type="number"
                  placeholder="Đến"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="delete-filter">
              <button onClick={clearFilters} className="btn btn-clear">
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="shop-toolbar">
        <div className="result-count">
          Tìm thấy <b>{filteredAndSortedCats.length}</b> kết quả
        </div>
        <div className="toolbar-actions">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sắp xếp theo tên</option>
            <option value="price-low">Giá thấp đến cao</option>
            <option value="price-high">Giá cao đến thấp</option>
            <option value="age">Tuổi</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredAndSortedCats.length === 0 ? (
        <div className="no-results">
          <Search className="no-results-icon" />
          <h3>Không tìm thấy kết quả</h3>
          <p>Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <>
          <div className="results-grid">
            {currentCats.map((cat) => (
              <div key={cat.id} className="cat-card">
                <img src={cat.imageUrl} alt={cat.catName} />
                <h3>{cat.catName}</h3>
                <p>Giống: {cat.breed}</p>
                <p>Tuổi: {calcAge(cat.dateOfBirth)}</p>
                <p>Giới tính: {translateGender(cat.gender)}</p>
                <p className="price">{cat.price.toLocaleString()} VNĐ</p>
                <button
                  onClick={() => {
                    navigate(`/shop/${cat.id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  Xem chi tiết
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination-shop">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              &lt; Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Sau &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
