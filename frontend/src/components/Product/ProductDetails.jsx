import React, { useEffect, useState } from "react";
import axios from "../../context/configAxios";
import { useParams } from "react-router-dom";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product-detail/${id}`);
        const productData = response.data;
        setProduct(productData);

        if (productData.mau_ma_san_phams.length > 0) {
          const initialColor = productData.mau_ma_san_phams[0].mau_sac;
          const initialSize = productData.mau_ma_san_phams[0].kich_co;
          setSelectedColor(initialColor);
          setSelectedSize(initialSize);

          const initialStock = productData.mau_ma_san_phams.find(
            (option) =>
              option.mau_sac === initialColor &&
              option.kich_co === initialSize
          )?.so_luong_ton_kho;
          setStock(initialStock);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedSize("");
    setStock(null);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    const stockValue = product.mau_ma_san_phams.find(
      (option) => option.mau_sac === selectedColor && option.kich_co === size
    )?.so_luong_ton_kho;
    setStock(stockValue);
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

  if (!product) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  const uniqueColors = Array.from(
    new Set(product.mau_ma_san_phams.map((option) => option.mau_sac))
  );

  const sizesForSelectedColor = product.mau_ma_san_phams.filter(
    (option) => option.mau_sac === selectedColor
  );

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-5">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          {/* Image Section */}
          <div className="md:w-1/2 relative">
            <div className="relative w-full h-96">
              <img
                src={product.hinh_anh_san_phams[currentImageIndex]}
                alt={`Product ${currentImageIndex + 1}`}
                className="w-full h-full object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    (prev) =>
                      (prev - 1 + product.hinh_anh_san_phams.length) %
                      product.hinh_anh_san_phams.length
                  )
                }
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
              >
                <IoIosArrowBack size={24} />
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    (prev) =>
                      (prev + 1) % product.hinh_anh_san_phams.length
                  )
                }
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
              >
                <IoIosArrowForward size={24} />
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.Ten_san_pham}</h1>
            <p className="text-xl font-semibold text-red-500 mb-6">
              {product.Gia.toLocaleString()}₫
            </p>
            <p className="text-gray-600 mb-6">{product.Mo_ta}</p>

            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2">Màu sắc:</h4>
              <div className="flex gap-3">
                {uniqueColors.map((color, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 border rounded-lg ${
                      selectedColor === color
                        ? "border-blue-500 bg-blue-100"
                        : "border-gray-300 hover:bg-gray-100"
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
              <div className="flex gap-3">
                {sizesForSelectedColor.map((option, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 border rounded-lg ${
                      selectedSize === option.kich_co
                        ? "border-blue-500 bg-blue-100"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                    onClick={() => handleSizeChange(option.kich_co)}
                  >
                    {option.kich_co}
                  </button>
                ))}
              </div>
            </div>

            {stock !== null && (
              <p className="text-gray-700 mb-6">
                Tồn kho: <span className="font-bold">{stock}</span>
              </p>
            )}

            <div className="flex items-center mb-6">
              <button
                className="px-4 py-2 bg-gray-100 rounded-l-lg hover:bg-gray-200"
                onClick={() => handleQuantityChange("decrease")}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                readOnly
                className="w-16 text-center border-t border-b border-gray-300"
              />
              <button
                className="px-4 py-2 bg-gray-100 rounded-r-lg hover:bg-gray-200"
                onClick={() => handleQuantityChange("increase")}
              >
                +
              </button>
            </div>

            <div className="flex gap-4">
              <button
                className="w-1/2 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
              >
                Thêm vào giỏ hàng
              </button>
              <button
                className="w-1/2 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
