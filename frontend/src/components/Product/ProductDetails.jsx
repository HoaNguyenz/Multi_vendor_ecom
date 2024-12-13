import React, { useEffect, useState } from "react";
import axios from "../../context/configAxios";
import { useParams } from "react-router-dom";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productImg, setProductImg] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [stock, setStock] = useState(null); // Tồn kho của tổ hợp được chọn
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State để theo dõi hình ảnh hiện tại

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product-detail/${id}`);
        setProduct(response.data);
        setProductImg(response.data.hinh_anh_san_phams);

        if (response.data.mau_ma_san_phams.length > 0) {
          const firstColor = response.data.mau_ma_san_phams[0].mau_sac;
          const firstSize = response.data.mau_ma_san_phams[0].kich_co;
          setSelectedColor(firstColor);
          setSelectedSize(firstSize);

          // Lấy tồn kho ban đầu
          const initialStock = response.data.mau_ma_san_phams.find(
            (option) =>
              option.mau_sac === firstColor && option.kich_co === firstSize
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
    setSelectedSize(""); // Reset kích cỡ khi chọn màu mới
    setStock(null); // Reset tồn kho
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);

    // Cập nhật tồn kho khi chọn kích cỡ
    const stockValue = product.mau_ma_san_phams.find(
      (option) => option.mau_sac === selectedColor && option.kich_co === size
    )?.so_luong_ton_kho;
    setStock(stockValue);
  };

  // Hàm chuyển sang hình ảnh tiếp theo
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % productImg.length);
  };

  // Hàm quay lại hình ảnh trước
  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + productImg.length) % productImg.length
    );
  };

  if (!product) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  // Lấy danh sách màu sắc duy nhất
  const uniqueColors = Array.from(
    new Set(product.mau_ma_san_phams.map((option) => option.mau_sac))
  );

  // Lọc kích cỡ dựa trên màu sắc đã chọn
  const sizesForSelectedColor = product.mau_ma_san_phams.filter(
    (option) => option.mau_sac === selectedColor
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      {/* Hiển thị hình ảnh hiện tại */}
      <div className="flex-shrink-0 relative">
        <div className="flex flex-col items-center gap-4 w-[50vh] h-[50vh] md:w-[35vw] md:h-[35vw] relative">
          <img
            className="w-full h-full object-contain rounded-lg border border-gray-200"
            src={productImg[currentImageIndex]}
            alt={`Hình ảnh sản phẩm ${currentImageIndex + 1}`}
          />

          {/* Các nút chuyển hình ảnh */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 px-4">
            <button
              onClick={prevImage}
              className="bg-gray-100 rounded-md hover:bg-blue-200 pl-2 pr-2 pt-4 pb-4"
            >
              <IoIosArrowBack className="md:size-8" color="black" />
            </button>
          </div>

          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 px-4">
            <button
              onClick={nextImage}
              className="bg-gray-100 rounded-md hover:bg-blue-200 pl-2 pr-2 pt-4 pb-4"
            >
              <IoIosArrowForward className="md:size-8" color="black" />
            </button>
          </div>

          {/* Các chấm biểu thị vị trí hiện tại */}
          <div className="flex justify-center">
            {productImg.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 mx-1 rounded-full ${
                  currentImageIndex === index ? "bg-blue-500" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <h1 className="text-2xl font-semibold mb-4">{product.Ten_san_pham}</h1>
        <p className="text-xl text-red-500 font-bold mb-4">
          {product.Gia.toLocaleString()}₫
        </p>
        <p className="text-gray-600 mb-6">{product.Mo_ta}</p>

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

        {stock !== null && (
          <p className="text-gray-700 mb-6">
            Tồn kho: <span className="font-bold">{stock}</span>
          </p>
        )}

        <button className="w-full md:w-auto px-6 py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600">
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
