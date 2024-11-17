import { React, useState } from "react";
import Select from "react-select";
import { ChromePicker } from "react-color";

const AddProductPopup = ({ onClose }) => {
  const [images, setImages] = useState([]);
  const [imageNames, setImageNames] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [origin, setOrigin] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState([]);
  const [customSize, setCustomSize] = useState("");
  const [availableSizes, setAvailableSizes] = useState([
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL",
  ]);
  const [color, setColor] = useState([]);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [colorName, setColorName] = useState("");
  const [stock, setStock] = useState({});
  const [category, setCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [categories, setCategories] = useState(["Áo", "Quần", "Phụ kiện"]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [priceError, setPriceError] = useState(null);
  const [stockError, setStockError] = useState(null);

  const categoryOptions = [
    ...categories.map((cat) => ({ value: cat, label: cat })),
    { value: "add_new", label: "+ Thêm danh mục mới" },
  ];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Check if adding these files would exceed the limit of 7
    if (images.length + files.length > 7) {
      setImageError("Bạn chỉ có thể tải lên tối đa 7 hình ảnh.");
      return;
    }

    setImageError(""); // Clear any existing error message
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Handle image delete
  const handleImageDelete = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleCategoryChange = (selectedOption) => {
    if (selectedOption.value === "add_new") {
      setIsAddingNewCategory(true);
      setCategory(null);
    } else {
      setIsAddingNewCategory(false);
      setCategory(selectedOption);
    }
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setCategory({ value: newCategory, label: newCategory });
      setNewCategory("");
      setIsAddingNewCategory(false);
    }
  };

  const handlePriceChange = (price) => {
    if (price < 0) {
      setPriceError("Không thể nhập giá trị âm");
      setHasError(true);
      return;
    } else {
      setPriceError(null);
      setHasError(false);
    }

    setPrice(price);
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSize((prevSizes) => [...prevSizes, value]);
    } else {
      setSize((prevSizes) => prevSizes.filter((s) => s !== value));
    }
  };

  const handleAddCustomSize = () => {
    if (customSize && !availableSizes.includes(customSize)) {
      setAvailableSizes((prevSizes) => [...prevSizes, customSize]);
      setSize((prevSizes) => [...prevSizes, customSize]);
      setCustomSize("");
    }
  };

  const handleAddColor = () => {
    if (colorName) {
      setColor((prevColors) => [
        ...prevColors,
        { name: colorName, value: selectedColor },
      ]);
      setColorPickerVisible(false);
      setColorName("");
    }
  };

  const handleDeleteColor = (index) => {
    const updatedColors = color.filter((_, i) => i !== index);
    setColor(updatedColors);
  };

  const handleStockChange = (size, color, quantity) => {
    if (quantity < 0) {
      setStockError("Không thể nhập giá trị âm");
      setHasError(true);
      return;
    } else {
      setStockError(null);
      setHasError(false);
    }
    const updatedStock = { ...stock };
    const stockKey = `${size}-${color}`;
    updatedStock[stockKey] = quantity;
    setStock(updatedStock);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    images.forEach((image, index) => {
      console.log(`Image ${index + 1}: ${image.file.name}`);
    });

    // Kiểm tra có ảnh sản phẩm chưa
    if (images.length === 0) {
      setImageError("Vui lòng chọn ít nhất một hình ảnh minh hoạ");
      setHasError(true);
      return;
    }

    // Kiểm tra nếu chưa chọn size hoặc màu sắc
    if (size.length === 0 || color.length === 0) {
      setErrorMessage("");
      setErrorMessage("Vui lòng chọn ít nhất một size và một màu sắc.");
      setHasError(true);

      return;
    }

    // Nếu các điều kiện trên đều thỏa mãn
    setErrorMessage(null);
    setHasError(false);

    // Xử lý lưu sản phẩm ở đây (nếu không có lỗi)
    console.log("Form submitted successfully!");
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white p-6 rounded shadow-lg w-[70%] max-h-[90%] overflow-y-auto no-scrollbar">
      
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">Thêm sản phẩm mới</h2>
      <button
        type="button"
        className="text-black border border-black px-2 py-2 rounded-full w-2 h-2 flex items-center justify-center"
        onClick={onClose}
      >
        X
      </button>
    </div>
        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Hình ảnh sản phẩm <span className="text-red-500">*</span>
              <span className="text-gray-300 font-extralight">
                {" "}
                Hình ảnh đầu tiên sẽ được đặt làm ảnh đại diện của sản phẩm
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="file-upload"
              disabled={images.length >= 7} // Disable input if limit is reached
            />
            {/* Custom button to trigger the file input */}
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-gray-200 px-4 py-2 rounded inline-block"
            >
              Chọn hình ảnh
            </label>
            {imageError && (
              <p className="text-red-500 text-sm mt-2">{imageError}</p>
            )}
            <div className="flex flex-wrap mt-2 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.preview}
                    alt={`product-preview-${index}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageDelete(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    X
                  </button>
                  <p className="text-gray-500 text-xs mt-1">
                    {image.file.name}
                  </p>{" "}
                  {/* Display image name */}
                </div>
              ))}
            </div>
          </div>

          {/* Tên sản phẩm */}
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={name}
              required
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
            <Select
              options={categoryOptions}
              value={category}
              required
              onChange={handleCategoryChange}
              placeholder="Chọn phân loại"
              className="w-full"
            />
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
              required
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
              required
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
              min={0}
              required
              placeholder="Nhập vào giá của sản phẩm"
              onChange={(e) => handlePriceChange(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {price < 0 && (
              <p className="text-red-500 text-sm mt-2">{priceError}</p>
            )}
          </div>

          {/* Size */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Size <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map((sizeOption) => (
                <label key={sizeOption} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    value={sizeOption}
                    checked={size.includes(sizeOption)}
                    onChange={handleSizeChange}
                  />
                  {sizeOption}
                </label>
              ))}
              <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                <input
                  type="text"
                  placeholder="Nhập kích thước khác"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSize}
                  className="bg-gray-200 px-2 py-1 rounded"
                >
                  + Thêm size
                </button>
              </div>
            </div>
            {errorMessage && size.length === 0 && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </div>

          {/* Màu sắc */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Màu sắc <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {color.map((col, index) => (
                <div key={index} className="flex items-center gap-1">
                  <span
                    style={{ backgroundColor: col.value }}
                    className="w-5 h-5 inline-block rounded-full"
                  ></span>
                  <span>{col.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteColor(index)}
                    className="text-red-500 text-xs"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setColorPickerVisible(!colorPickerVisible)}
              className="mt-2 bg-gray-200 px-4 py-1 rounded"
            >
              + Thêm màu sắc
            </button>
            {colorPickerVisible && (
              <div className="mt-2">
                <ChromePicker
                  color={selectedColor}
                  onChange={(color) => setSelectedColor(color.hex)}
                />
                <input
                  type="text"
                  placeholder="Tên màu sắc"
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 mt-2"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
                >
                  Thêm màu
                </button>
              </div>
            )}
            {errorMessage && color.length === 0 && size.length !== 0 && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </div>

          {/* Tồn kho */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Tồn kho <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-4">
              {size.map((s) =>
                color.map((c) => (
                  <div
                    key={`${s}-${c.name}`}
                    className="flex items-center gap-2"
                  >
                    <label className="text-sm">{`${s}, ${c.name}`}</label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={stock[`${s}-${c.name}`] || ""}
                      onChange={(e) =>
                        handleStockChange(s, c.name, e.target.value)
                      }
                      className="w-20 border border-gray-300 rounded px-2 py-1"
                      placeholder="Số lượng"
                    />
                    {stockError && stock[`${s}-${c.name}`] < 0 && (
                      <p className="text-red-500 text-sm mt-2">{stockError}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mô tả */}
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="description"
              value={description}
              required
              placeholder="Mô tả ngắn về sản phẩm của bạn"
              onChange={(e) => setDescription(e.target.value)}
              className="custom-input w-full border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
              maxLength={300} // Set max length
            />
            <p className="text-gray-500 text-sm mt-1">
              {description.length}/300
            </p>
          </div>

          <div className="mt-4 flex justify-center gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded "
            >
              Lưu
            </button>
            <button
              type="button"
              className="ml-2 text-red-500 border border-red-500 px-4 py-2 rounded"
              onClick={onClose}
            >
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPopup;
