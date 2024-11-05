import { React, useState } from "react";

const AddProductPopup = ({ onClose }) => {
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [origin, setOrigin] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [categories, setCategories] = useState(["Áo", "Quần", "Phụ kiện"]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === "add_new") {
      setIsAddingNewCategory(true);
      setCategory("");
    } else {
      setIsAddingNewCategory(false);
      setCategory(selectedCategory);
    }
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setCategory(newCategory);
      setNewCategory("");
      setIsAddingNewCategory(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[70%]">
        <h2 className="text-lg font-semibold mb-4">Thêm sản phẩm mới</h2>
        <form onSubmit={handleSubmit}>
            {/* Tên sản phẩm */}
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Nhập vào tên sản phẩm"
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
            {/* Phân loại */}
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Phân loại <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Chọn phân loại</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="add_new">+ Thêm danh mục mới</option>
            </select>
            {isAddingNewCategory && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Nhập danh mục mới"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
                >
                  Thêm danh mục
                </button>
              </div>
            )}
          </div>
            {/* Xuất xứ */}
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Xuất xứ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="origin"
              value={origin}
              placeholder="Nhập vào nơi sản xuất"
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
            {/* Thương hiệu */}
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Thương hiệu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="brand"
              value={brand}
              placeholder="Nhập vào thương hiệu của sản phẩm"
              onChange={(e) => setBrand(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* Giá */}
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Đơn giá (VNĐ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={price}
              placeholder="Nhập vào giá của sản phẩm"
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Lưu
          </button>
          <button type="button" className="ml-2 text-red-500" onClick={onClose}>
            Đóng
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPopup;
