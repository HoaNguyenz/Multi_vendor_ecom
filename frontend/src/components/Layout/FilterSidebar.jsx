import React, { useState, useEffect } from "react";
import axios from "../../context/configAxios";
import { FaFilter } from "react-icons/fa6";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

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

  const handlePriceSliderChange = (values) => {
    setLocalFilters((prev) => ({
      ...prev,
      priceMin: values[0] * 1000, // Chuyển lại giá trị thành đơn vị đồng
      priceMax: values[1] * 1000,
    }));
  };

  return (
    <div className="w-[15vw] p-4 border-r border-gray-200 bg-white sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
      {/* Xuất xứ */}
      <div className="mb-4">
        <div className="flex justify-between items-center font-medium mb-2 space-x-2">
          <span className="text-blue-400">Xuất xứ</span>
          <button
            onClick={applyFilters}
            className="p-2 rounded-lg border-gray-100 hover:bg-blue-100 shadow-md transition-all duration-200 ease-in-out"
          >
            <FaFilter className="text-blue-400" />
          </button>
        </div>
        {options.origins.map((origin) => (
          <div key={origin} className="flex items-center mb-1 group">
            <input
              type="checkbox"
              name="origins"
              value={origin}
              checked={localFilters.origins.includes(origin)}
              onChange={handleFilterChange}
              className="mr-2 w-4 h-4 border-gray-300 rounded focus:ring-0 group-hover:border-blue-500 group-hover:ring-2 group-hover:ring-blue-500 transition duration-200"
            />
            <span className="text-gray-700 group-hover:text-blue-500 transition duration-200">
              {origin}
            </span>
          </div>
        ))}
      </div>
      <hr className="border-t border-gray-300 my-4" />
      {/* Thương hiệu */}
      <div className="mb-4">
        <div className="flex justify-between items-center font-medium mb-2 space-x-2">
          <span className="text-blue-400">Thương hiệu</span>
          <button
            onClick={applyFilters}
            className="p-2 rounded-lg border-gray-100 hover:bg-blue-100 shadow-md transition-all duration-200 ease-in-out"
          >
            <FaFilter className="text-blue-400" />
          </button>
        </div>
        {options.brands.map((brand) => (
          <div key={brand} className="flex items-center mb-1 group">
            <input
              type="checkbox"
              name="brands"
              value={brand}
              checked={localFilters.brands.includes(brand)}
              onChange={handleFilterChange}
              className="mr-2 w-4 h-4 border-gray-300 rounded focus:ring-0 group-hover:border-blue-500 group-hover:ring-2 group-hover:ring-blue-500 transition duration-200"
            />
            <span className="text-gray-700 group-hover:text-blue-500 transition duration-200">
              {brand}
            </span>
          </div>
        ))}
      </div>
      <hr className="border-t border-gray-300 my-4" />
      {/* Màu sắc */}
      <div className="mb-4">
        <div className="flex justify-between items-center font-medium mb-2 space-x-2">
          <span className="text-blue-400">Màu sắc</span>
          <button
            onClick={applyFilters}
            className="p-2 rounded-lg border-gray-100 hover:bg-blue-100 shadow-md transition-all duration-200 ease-in-out"
          >
            <FaFilter className="text-blue-400" />
          </button>
        </div>
        {options.colors.map((color) => (
          <div key={color} className="flex items-center mb-1 group">
            <input
              type="checkbox"
              name="colors"
              value={color}
              checked={localFilters.colors.includes(color)}
              onChange={handleFilterChange}
              className="mr-2 w-4 h-4 border-gray-300 rounded focus:ring-0 group-hover:border-blue-500 group-hover:ring-2 group-hover:ring-blue-500 transition duration-200"
            />
            <span className="text-gray-700 group-hover:text-blue-500 transition duration-200">
              {color}
            </span>
          </div>
        ))}
      </div>
      <hr className="border-t border-gray-300 my-4" />
      {/* Kích cỡ */}
      <div className="mb-4">
        <div className="flex justify-between items-center font-medium mb-2 space-x-2">
          <span className="text-blue-400">Kích cỡ</span>
          <button
            onClick={applyFilters}
            className="p-2 rounded-lg border-gray-100 hover:bg-blue-100 shadow-md transition-all duration-200 ease-in-out"
          >
            <FaFilter className="text-blue-400" />
          </button>
        </div>
        {options.sizes.map((size) => (
          <div key={size} className="flex items-center mb-1 group">
            <input
              type="checkbox"
              name="sizes"
              value={size}
              checked={localFilters.sizes.includes(size)}
              onChange={handleFilterChange}
              className="mr-2 w-4 h-4 border-gray-300 rounded focus:ring-0 group-hover:border-blue-500 group-hover:ring-2 group-hover:ring-blue-500 transition duration-200"
            />
            <span className="text-gray-700 group-hover:text-blue-500 transition duration-200">
              {size}
            </span>
          </div>
        ))}
      </div>
      <hr className="border-t border-gray-300 my-4" />
      {/* Khoảng giá */}
      {/* <div className="mb-4">
        <div className="flex justify-between items-center font-medium mb-2 space-x-2">
          <span className="text-blue-400">Khoảng giá</span>
          <button 
            onClick={applyFilters}
            className="p-2 rounded-lg border-gray-100 hover:bg-blue-100 shadow-md transition-all duration-200 ease-in-out">
            <FaFilter className="text-blue-400" />
          </button>
        </div>
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
      </div> */}
      <div className="mb-4">
        <div className="flex justify-between items-center font-medium mb-2 space-x-2">
          <span className="text-blue-400">Khoảng giá</span>
          <button
            onClick={applyFilters}
            className="p-2 rounded-lg border-gray-100 hover:bg-blue-100 shadow-md transition-all duration-200 ease-in-out"
          >
            <FaFilter className="text-blue-400" />
          </button>
        </div>
        <div className="px-4">
          <Slider
            range
            min={0}
            max={10000} // Giá trị tối đa: 1,000 tương ứng 1,000,000 đồng
            step={10} // Bước tăng giảm: 10 tương ứng 10,000 đồng
            value={[
              (localFilters.priceMin || 0) / 1000,
              (localFilters.priceMax || 10000000) / 1000,
            ]}
            onChange={handlePriceSliderChange}
            className="mt-4"
          />
          <div className="flex justify-between mt-2 text-gray-700">
            <span>{((localFilters.priceMin || 0) / 1000).toLocaleString()}</span>
            <span>{((localFilters.priceMax || 10000000) / 1000).toLocaleString()}</span>
          </div>
          <div className="text-sm text-gray-500 text-right mt-1">
            *Ngàn Đồng
          </div>
        </div>
      </div>
      <hr className="border-t border-gray-300 my-4" />
      {/* Tình trạng hàng */}
      <div className="mb-4">
        <div className="flex justify-between items-center font-medium mb-2 space-x-2">
          <span className="text-blue-400">Tình trạng hàng</span>
          <button
            onClick={applyFilters}
            className="p-2 rounded-lg border-gray-100 hover:bg-blue-100 shadow-md transition-all duration-200 ease-in-out"
          >
            <FaFilter className="text-blue-400" />
          </button>
        </div>
        <div className="flex items-center mb-1 group">
          <input
            type="radio"
            name="inStock"
            value={true}
            checked={localFilters.inStock === true}
            onChange={() => handleInStockChange(true)}
            className="mr-2 w-4 h-4"
          />
          <span className="text-gray-700 group-hover:text-blue-500 transition duration-200">
            Còn hàng
          </span>
        </div>
        <div className="flex items-center mb-1 group">
          <input
            type="radio"
            name="inStock"
            value={false}
            checked={localFilters.inStock === false}
            onChange={() => handleInStockChange(false)}
            className="mr-2 w-4 h-4"
          />
          <span className="text-gray-700 group-hover:text-blue-500 transition duration-200">
            Hết hàng
          </span>
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
