import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation để lấy tham số từ URL
import axios from "../../context/configAxios"; // Import axios
import FilterSidebar from "../Layout/FilterSidebar";
import ProductCard from "./ProductCard"; // Import ProductCard

const SearchResults = () => {
  const [products, setProducts] = useState([]);
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
  
        const response = await axios.get(`/search-products?${query.toString()}`);
        const uniqueProducts = Array.from(
          new Map(response.data.map((item) => [item.Ma_san_pham, item])).values()
        );
  
        setProducts(uniqueProducts);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setErrorMessage("Không có sản phẩm nào phù hợp với yêu cầu tìm kiếm.");
        } else {
          setErrorMessage("Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại.");
        }
        setProducts([]); // Đảm bảo không hiển thị sản phẩm cũ
      } finally {
        setLoading(false); // Hoàn tất quá trình tải
      }
    };
  
    fetchProducts();
  }, [searchTerm, category, filters]);
  
  return (
    <div className="flex">
      <FilterSidebar filters={filters} setFilters={setFilters} />

      <div className="w-3/4 p-4">
        <h1 className="text-2xl font-bold mb-4">
          Kết quả tìm kiếm cho "{searchTerm || category}"
        </h1>

        {loading ? (
          <p>Đang tải sản phẩm...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.Ma_san_pham} product={product} />
            ))}
          </div>
        ) : (
          <p>Không tìm thấy sản phẩm phù hợp.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

