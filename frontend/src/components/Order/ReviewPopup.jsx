import React, { useState } from "react";
import axios from "../../context/configAxios";
import { useAuth } from "../../context/AuthContext";

const ReviewPopup = ({ open, onClose, product, maDonHang }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null); // File ảnh
  const [imagePreview, setImagePreview] = useState(null); // Ảnh xem trước
  const { user } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      alert("Điểm đánh giá phải nằm trong khoảng từ 1 đến 5!");
      return;
    }

    try {
      let uploadedImageURL = null;

      // Chỉ tải ảnh lên nếu người dùng chọn ảnh
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "eCommerce_ReviewPreset"); // Preset của Cloudinary
        formData.append("folder", "eCommerce_Review");

        const uploadResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dlihdjok9/image/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: "",
          }
        );

        if (uploadResponse.status === 200) {
          uploadedImageURL = uploadResponse.data.secure_url; // Lấy URL ảnh đã tải lên
        } else {
          throw new Error("Lỗi khi tải ảnh lên Cloudinary");
        }
      }

      // Gửi dữ liệu đánh giá
      const reviewData = {
        sdt: user.sdt,
        maSanPham: product.Ma_san_pham,
        diemDanhGia: rating,
        nhanXet: comment || null,
        urlHinhAnh: uploadedImageURL || null,
        mauMaSp: product.Mau_ma_sp,
        maDonHang
      };

      const response = await axios.post("review", reviewData);

      if (response.status === 201) {
        alert("Đánh giá đã được gửi thành công!");
        onClose();
        window.location.reload();
      } else {
        alert("Đã xảy ra lỗi khi gửi đánh giá!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      alert("Không thể gửi đánh giá. Vui lòng thử lại!");
    }
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  return (
    open && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-4/5 max-w-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Đánh giá sản phẩm</h2>
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
            >
              Đóng
            </button>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">{product.Ten_san_pham}</h3>
            <div className="mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={index < rating ? "gold" : "none"}
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-8 h-8 cursor-pointer"
                    onClick={() => handleStarClick(index)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 17.27l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l5.46 4.73L6.82 21z"
                    />
                  </svg>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Nhận xét</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows="4"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Thêm ảnh minh họa</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded-md"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-4 w-full max-h-64 object-cover rounded-md"
                />
              )}
            </div>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ReviewPopup;
