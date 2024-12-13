import React, { useState, useEffect } from "react";
import axios from "../../context/configAxios";

const ProductDetailPopup = ({ setOpen, productData, updateCart }) => {
  const [productDetail, setProductDetail] = useState(null); // Lưu thông tin chi tiết sản phẩm
  const [selectedColor, setSelectedColor] = useState(productData.Mau_sac);
  const [selectedSize, setSelectedSize] = useState(productData.Kich_co);
  const [quantity, setQuantity] = useState(productData.So_luong);
  const [stock, setStock] = useState(null); // Tồn kho của tổ hợp được chọn

  // Lọc màu sắc duy nhất
  const getUniqueColors = (options) => {
    return [...new Set(options.map((option) => option.mau_sac))];
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(
          `/product-detail/${productData.Ma_san_pham}`
        );
        setProductDetail(response.data);
        const initialStock = response.data.mau_ma_san_phams.find(
          (option) =>
            option.mau_sac === selectedColor && option.kich_co === selectedSize
        )?.so_luong_ton_kho;
        setStock(initialStock);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetail();
  }, [productData.Ma_san_pham, selectedColor, selectedSize]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedSize(""); // Reset kích cỡ khi chọn màu mới
    setStock(null); // Reset tồn kho
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    const selectedOption = productDetail.mau_ma_san_phams.find(
      (option) => option.mau_sac === selectedColor && option.kich_co === size
    );
    setStock(selectedOption?.so_luong_ton_kho || 0); // Cập nhật tồn kho
  };

  const handleQuantityChange = (operation) => {
    setQuantity((prevQuantity) => {
      if (operation === "increase" && prevQuantity < stock) {
        return prevQuantity + 1;
      } else if (operation === "decrease" && prevQuantity > 1) {
        return prevQuantity - 1;
      }
      return prevQuantity;
    });
  };

  const handleUpdateCart = async () => {
    try {
      // Tìm `id` tương ứng với màu sắc và kích cỡ được chọn
      const selectedOption = productDetail.mau_ma_san_phams.find(
        (option) =>
          option.mau_sac === selectedColor && option.kich_co === selectedSize
      );

      if (!selectedOption) {
        throw new Error(
          "Không tìm thấy sản phẩm với tổ hợp màu sắc và kích cỡ này."
        );
      }

      const updatedProduct = {
        mau_ma_sp: selectedOption.id, // Gán id của tổ hợp đã chọn
        so_luong: quantity,
      };

      await axios.put(`/cart`, updatedProduct); // Gửi dữ liệu lên server
      updateCart(updatedProduct); // Cập nhật lại giỏ hàng trong UI
      setOpen(false); // Đóng popup
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleAddToCart = async () => {
    try {
      // Tìm `id` tương ứng với màu sắc và kích cỡ được chọn
      const selectedOption = productDetail.mau_ma_san_phams.find(
        (option) =>
          option.mau_sac === selectedColor && option.kich_co === selectedSize
      );

      if (!selectedOption) {
        throw new Error("Không tìm thấy sản phẩm với tổ hợp màu sắc và kích cỡ này.");
      }

      const newProduct = {
        mau_ma_sp: selectedOption.id, // Gán id của tổ hợp đã chọn
        so_luong: quantity,
      };

      await axios.post(`/cart`, newProduct);
      updateCart(newProduct); // Cập nhật lại giỏ hàng trong UI
      alert("Đã thêm sản phẩm mới vào giỏ hàng.");
      setOpen(false); // Đóng popup nếu cần
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Thêm sản phẩm vào giỏ hàng thất bại.");
    }
  };

  if (!productDetail) {
    return (
      <div className="fixed w-full h-screen top-0 left-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">Loading...</div>
      </div>
    );
  }

  const uniqueColors = getUniqueColors(productDetail.mau_ma_san_phams);
  const sizesForSelectedColor = productDetail.mau_ma_san_phams.filter(
    (item) => item.mau_sac === selectedColor
  );

  return (
    <div className="fixed w-full h-screen top-0 left-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
      <div className="w-[90%] md:w-[60%] bg-white rounded-lg p-6 shadow-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={() => setOpen(false)}
        >
          ✖
        </button>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2">
            <img
              src={productData.Url_thumbnail || "https://via.placeholder.com/300"}
              alt={productData.Ten_san_pham}
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
          <div className="w-full md:w-1/2 mt-4 md:mt-0 md:pl-6">
            <h1 className="text-2xl font-bold">{productData.Ten_san_pham}</h1>
            <p className="text-gray-600 mt-2">{productDetail.Thuong_hieu}</p>
            <p className="text-lg text-gray-900 font-semibold mt-4">
              {productData.Gia.toLocaleString()} VND
            </p>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">Màu sắc:</h4>
              <div className="flex gap-2">
                {uniqueColors.map((color, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 border rounded-md ${
                      selectedColor === color
                        ? "border-blue-500 bg-blue-100"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleColorChange(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">Kích cỡ:</h4>
              <div className="flex gap-2">
                {sizesForSelectedColor.map((option, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === option.kich_co
                        ? "border-blue-500 bg-blue-100"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleSizeChange(option.kich_co)}
                  >
                    {option.kich_co}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-2 text-sm text-gray-500">Tồn kho: {stock || 0}</p>

            <div className="flex items-center mt-4">
              <button
                onClick={() => handleQuantityChange("decrease")}
                className="px-4 py-2 bg-gray-300 rounded-l"
              >
                -
              </button>
              <span className="px-4 py-2 border">{quantity}</span>
              <button
                onClick={() => handleQuantityChange("increase")}
                className="px-4 py-2 bg-gray-300 rounded-r"
              >
                +
              </button>
            </div>

            <div className="flex items-center justify-end mt-6">
              <button
                onClick={handleUpdateCart}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Cập nhật giỏ hàng
              </button>
              <button
                onClick={handleAddToCart}
                className="ml-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Thêm mới sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPopup;
