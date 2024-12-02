import React, { useState, useEffect } from "react";
import axios from "../../context/configAxios";

const FilterSidebar = ({ filters, setFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters); // Bản sao cục bộ của filters
  const [options, setOptions] = useState({
    origins: [],
    brands: [],
    colors: [],
    sizes: [],
  });

  // Lấy dữ liệu options từ API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("/filter-options");
        setOptions(response.data); // Cập nhật options khi lấy dữ liệu
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
  
    setLocalFilters((prev) => {
      const prevValues = prev[name] || [];
      const updatedValues = checked
        ? [...prevValues, value]
        : prevValues.filter((v) => v !== value);
  
      return {
        ...prev,
        [name]: updatedValues,
      };
    });
  };
  
  // Cập nhật giá trị cho inStock khi chọn tình trạng hàng
  const handleInStockChange = (value) => {
    setLocalFilters((prev) => ({
      ...prev,
      inStock: value, // Truyền giá trị true hoặc false
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gửi toàn bộ dữ liệu filters lên SearchResults
  const applyFilters = () => {
    setFilters(localFilters); // Truyền giá trị filters lên component cha (SearchResults)
  };

  const resetFilters = () => {
    setLocalFilters({
      origins: [],
      brands: [],
      priceMin: "",
      priceMax: "",
      colors: [],
      sizes: [],
      inStock: "",
    });
  };

  return (
    <div className="w-[15vw] p-4 border-r border-gray-200">
      <h2 className="text-lg font-bold mb-4">Lọc sản phẩm</h2>

      {/* Xuất xứ */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Xuất xứ</label>
        {options.origins.map((origin) => (
          <div key={origin} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="origins"
              value={origin}
              checked={localFilters.origins.includes(origin)}
              onChange={handleFilterChange}
              className="mr-2"
            />
            <span>{origin}</span>
          </div>
        ))}
      </div>

      {/* Thương hiệu */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Thương hiệu</label>
        {options.brands.map((brand) => (
          <div key={brand} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="brands"
              value={brand}
              checked={localFilters.brands.includes(brand)}
              onChange={handleFilterChange}
              className="mr-2"
            />
            <span>{brand}</span>
          </div>
        ))}
      </div>

      {/* Màu sắc */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Màu sắc</label>
        {options.colors.map((color) => (
          <div key={color} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="colors"
              value={color}
              checked={localFilters.colors.includes(color)}
              onChange={handleFilterChange}
              className="mr-2"
            />
            <span>{color}</span>
          </div>
        ))}
      </div>

      {/* Kích cỡ */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Kích cỡ</label>
        {options.sizes.map((size) => (
          <div key={size} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="sizes"
              value={size}
              checked={localFilters.sizes.includes(size)}
              onChange={handleFilterChange}
              className="mr-2"
            />
            <span>{size}</span>
          </div>
        ))}
      </div>

      {/* Khoảng giá */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Khoảng giá</label>
        <div className="flex space-x-2">
          <input
            type="number"
            name="priceMin"
            placeholder="Từ"
            value={localFilters.priceMin}
            onChange={handlePriceChange}
            className="w-1/2 border border-gray-300 p-2 rounded"
          />
          <input
            type="number"
            name="priceMax"
            placeholder="Đến"
            value={localFilters.priceMax}
            onChange={handlePriceChange}
            className="w-1/2 border border-gray-300 p-2 rounded"
          />
        </div>
      </div>

      {/* Tình trạng hàng */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Tình trạng hàng</label>
        <div className="flex items-center mb-1">
          <input
            type="radio"
            name="inStock"
            value={true}
            checked={localFilters.inStock === true}
            onChange={() => handleInStockChange(true)}
            className="mr-2"
          />
          <span>Còn hàng</span>
        </div>
        <div className="flex items-center mb-1">
          <input
            type="radio"
            name="inStock"
            value={false}
            checked={localFilters.inStock === false}
            onChange={() => handleInStockChange(false)}
            className="mr-2"
          />
          <span>Hết hàng</span>
        </div>
      </div>

      <button
        onClick={resetFilters}
        className="w-full bg-gray-500 text-white p-2 rounded mb-2"
      >
        Xóa bộ lọc
      </button>

      <button
        onClick={applyFilters}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Lọc
      </button>
    </div>
  );
};

export default FilterSidebar;
