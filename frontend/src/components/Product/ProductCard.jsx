import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../context/configAxios";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/review/${product.Ma_san_pham}`);
        const data = response.data;

        setReviews(data);

        // Tính tổng số điểm và số lượt đánh giá
        const totalRatings = data.length;
        const totalScore = data.reduce((sum, review) => sum + review.DiemDanhGia, 0);
        const averageRating = totalRatings > 0 ? totalScore / totalRatings : 0;

        setAverageRating(averageRating.toFixed(1)); // Giữ 1 chữ số thập phân
        setTotalRatings(totalRatings);
      } catch (error) {
        console.error("Lỗi khi lấy đánh giá:", error);
      }
    };

    fetchReviews();
  }, [product.Ma_san_pham]);
  const handleCardClick = () => {
    navigate(`/product/${product.Ma_san_pham}`);
  };

  return (
    <div
      className="w-full max-w-[300px] bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* Hình ảnh sản phẩm */}
        <img
          src={product.Url_thumbnail || "https://via.placeholder.com/150"}
          alt={product.Ten_san_pham}
          className="w-full h-[200px] object-cover rounded-lg cursor-pointer"
        />

        {/* Hiển thị thông tin nhanh khi hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex flex-col justify-center items-center p-4 rounded-lg">
            <p className="text-lg font-semibold">{product.Ten_san_pham}</p>
            <p className="text-sm mt-2">{product.Mo_ta || "Mô tả ngắn"}</p>
          </div>
        )}
      </div>

      {/* Thông tin sản phẩm */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.Ten_san_pham}</h3>
        <p className="text-sm text-gray-500">{product.Thuong_hieu}</p>
        <div className="flex items-center mt-2">
          {/* Hiển thị đánh giá */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ${index < averageRating ? "text-yellow-400" : "text-gray-300"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                stroke="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 15l-3.618 2.409L7.52 12.09 4 8.591l4.82-.409L10 2l1.18 5.773L16 8.591l-3.52 3.499L13.618 17.41z"
                  clipRule="evenodd"
                />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">({totalRatings} Ratings)</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-semibold text-gray-600">Đã bán {product.SL_da_ban}</span>
        </div>
        {/* Giá sản phẩm */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-semibold text-gray-900">{product.Gia.toLocaleString()} VND</span>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
