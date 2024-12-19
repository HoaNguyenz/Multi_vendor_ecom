import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation để lấy tham số từ URL
import axios from "../../context/configAxios"; // Import axios
import FilterSidebar from "../Layout/FilterSidebar";
import ProductCard from "./ProductCard"; // Import ProductCard

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20;
  const [filters, setFilters] = useState({
    origins: [],
    brands: [],
    priceMin: "",
    priceMax: "",
    colors: [],
    sizes: [],
    inStock: "",
  });
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Bắt đầu tải dữ liệu
      setErrorMessage(""); // Reset thông báo lỗi trước mỗi lần gọi API
      try {
        const query = new URLSearchParams({
          keyword: searchTerm || "",
          category: category || "",
          priceMin: filters.priceMin || "",
          priceMax: filters.priceMax || "",
          inStock: filters.inStock,
          sort: filters.sort || "",
          page: page.toString(),
          limit: limit.toString(),
        });

        if (filters.origins.length > 0) {
          filters.origins.forEach((value) => query.append("origin", value));
        }
        if (filters.brands.length > 0) {
          filters.brands.forEach((value) => query.append("brand", value));
        }
        if (filters.colors.length > 0) {
          filters.colors.forEach((value) => query.append("color", value));
        }
        if (filters.sizes.length > 0) {
          filters.sizes.forEach((value) => query.append("size", value));
        }

        const response = await axios.get(
          `/search-products?${query.toString()}`
        );
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages); // Cập nhật tổng số trang
        setTotalCount(response.data.totalCount); // Cập nhật tổng số sản phẩm
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setErrorMessage(
            "Không có sản phẩm nào phù hợp với yêu cầu tìm kiếm."
          );
        } else {
          setErrorMessage("Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại.");
        }
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, category, filters]);

  const renderFilterText = () => {
    const filterTexts = [];

    if (searchTerm) {
      filterTexts.push(`Tìm kiếm: "${searchTerm}"`);
    }

    if (category) {
      filterTexts.push(`Danh mục: "${category}"`);
    }

    if (filters.origins.length > 0) {
      filterTexts.push(`Xuất xứ: ${filters.origins.join(", ")}`);
    }

    if (filters.brands.length > 0) {
      filterTexts.push(`Thương hiệu: ${filters.brands.join(", ")}`);
    }

    if (filters.priceMin && filters.priceMax) {
      const priceMin = filters.priceMin.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
      const priceMax = filters.priceMax.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
      filterTexts.push(`Giá: từ ${priceMin} đến ${priceMax}`);
    }

    if (filters.colors.length > 0) {
      filterTexts.push(`Màu sắc: ${filters.colors.join(", ")}`);
    }

    if (filters.sizes.length > 0) {
      filterTexts.push(`Kích cỡ: ${filters.sizes.join(", ")}`);
    }

    if (filters.inStock !== "") {
      filterTexts.push(filters.inStock === "true" ? "Còn hàng" : "Hết hàng");
    }

    return filterTexts.length > 0
      ? filterTexts.join(" | ")
      : "Không có bộ lọc nào được chọn";
  };

  return (
    <div className="flex bg-white">
      <FilterSidebar filters={filters} setFilters={setFilters} />

      <div className="w-4/5 p-4 mx-auto">
        <div className="flex justify-between items-center mb-4 text-gray-700">
          <h2 className="text-xl font-bold mb-2">
            Kết quả tìm kiếm cho "{searchTerm || category}"
          </h2>
          <select
            className="border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          >
            <option value="">Sắp xếp</option>
            <option value="priceDesc">Giá cao đến thấp</option>
            <option value="priceAsc">Giá thấp đến cao</option>
            <option value="newest">Mới cập nhật</option>
            <option value="oldest">Cũ nhất</option>
          </select>
        </div>
        <div className="flex justify-between items-center mb-4 text-gray-700">
          <p>{renderFilterText()}</p>
          <p className="w-[10%]">({totalCount} kết quả)</p>{" "}
          {/* Hiển thị tổng số kết quả */}
        </div>
        <hr className="border-gray-300 my-4" />
        {loading ? (
          <p>Đang tải sản phẩm...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.Ma_san_pham} product={product} />
              ))}
            </div>
            <hr className="border-gray-300 my-6" />
            {/* Phân trang */}
            <div className="flex justify-center mt-4 w-full">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-blue-400 text-white disabled:opacity-50 rounded-md w-32 sm:w-40 lg:w-48"
              >
                Trước
              </button>
              <span className="mx-2 my-2">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="px-4 py-2 bg-blue-400 text-white disabled:opacity-50 rounded-md w-32 sm:w-40 lg:w-48"
              >
                Sau
              </button>
            </div>
          </>
        ) : (
          <p>Không tìm thấy sản phẩm phù hợp.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
