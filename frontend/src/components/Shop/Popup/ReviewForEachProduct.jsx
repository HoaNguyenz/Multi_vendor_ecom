import React from "react";

const ReviewForEachProduct = ({ reviewData, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/5 max-w-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Đánh giá từ người dùng
          </h2>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
          >
            Đóng
          </button>
        </div>
        <div>
          <p className="text-lg font-semibold mb-2">Nội dung đánh giá:</p>
          <p className="text-gray-700 mb-4">{reviewData.Nhan_xet}</p>

          <p className="text-lg font-semibold mb-2">Điểm đánh giá:</p>
          <p className="text-yellow-500 text-2xl">{reviewData.Diem_danh_gia}/5</p>

          {reviewData.Url_hinh_anh && (
            <div className="mt-4">
              <p className="text-lg font-semibold mb-2">Hình ảnh:</p>
              <img
                src={reviewData.Url_hinh_anh}
                alt="Hình ảnh đánh giá"
                className="w-full max-h-60 object-contain rounded-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewForEachProduct;
