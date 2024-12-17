import React, { useEffect, useState } from "react";
import axios from "../../context/configAxios";

const ProductReview = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/review/${productId}`);
        const fetchedReviews = response.data;

        // Tính điểm trung bình
        const avgRating =
          fetchedReviews.reduce((sum, review) => sum + review.DiemDanhGia, 0) /
          fetchedReviews.length;

        // Đếm số lượng mỗi mức sao
        const count = {};
        fetchedReviews.forEach((review) => {
          count[review.DiemDanhGia] = (count[review.DiemDanhGia] || 0) + 1;
        });

        setReviews(fetchedReviews);
        setAverageRating(avgRating || 0); // Đặt 0 nếu không có đánh giá
        setRatingCount(count);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Ratings & Reviews</h2>
      <div className="flex items-start gap-16">
        {/* Phần điểm trung bình và sao */}
        <div className="flex items-center gap-4">
          <span className="text-5xl font-bold text-yellow-500">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex flex-col">
            <div className="flex">
              {Array.from({ length: 5 }, (_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${
                    index < Math.round(averageRating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.429 8.217 1.193-5.936 5.787 1.4 8.171L12 18.897l-7.349 3.87 1.4-8.171-5.936-5.787 8.217-1.193L12 .587z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600">{reviews.length} Ratings</span>
          </div>
        </div>

        {/* Thanh biểu đồ rating */}
        <div className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              {/* Số và ngôi sao nằm ngang */}
              <div className="flex items-center gap-1 w-8">
                <span className="text-gray-700 font-medium">{star}</span>
                <span className="text-yellow-500">★</span>
              </div>

              {/* Thanh biểu đồ */}
              <div className="w-48 bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-yellow-500"
                  style={{
                    width: `${
                      ((ratingCount[star] || 0) / reviews.length) * 100 || 0
                    }%`,
                  }}
                ></div>
              </div>

              {/* Số lượng đánh giá */}
              <span className="text-gray-500 font-medium">
                {ratingCount[star] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Danh sách đánh giá */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Product Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">
            Chưa có đánh giá nào từ khách hàng.
          </p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="border-t py-4 flex flex-col gap-2">
              {/* Sao đánh giá và ngày đánh giá */}
              <div className="flex justify-between items-center">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, starIndex) => (
                    <svg
                      key={starIndex}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${
                        starIndex < review.DiemDanhGia
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 .587l3.668 7.429 8.217 1.193-5.936 5.787 1.4 8.171L12 18.897l-7.349 3.87 1.4-8.171-5.936-5.787 8.217-1.193L12 .587z" />
                    </svg>
                  ))}
                </div>
                {/* Ngày đánh giá */}
                <span className="text-sm text-gray-500">
                  {new Date(review.ThoiGian).toLocaleDateString()}
                </span>
              </div>

              {/* Số điện thoại */}
              <span className="text-sm text-gray-500">{review.Sdt}</span>

              {/* Nội dung đánh giá */}
              <p className="text-gray-800">{review.NhanXet}</p>

              {/* Hình ảnh đánh giá */}
              {review.UrlHinhAnh && (
                <div className="mt-2">
                  <img
                    src={review.UrlHinhAnh}
                    alt="Hình ảnh đánh giá"
                    onClick={() => setSelectedImage(review.UrlHinhAnh)}
                    className="w-20 h-20 object-cover rounded-md border cursor-pointer"
                  />
                </div>
              )}
            </div>
          ))
        )}
        {/* Modal hiển thị ảnh */}
        {selectedImage && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
            onClick={() => setSelectedImage(null)} // Đóng modal khi click bên ngoài
          >
            <img
              src={selectedImage}
              alt="Ảnh phóng to"
              className="max-w-full max-h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReview;
