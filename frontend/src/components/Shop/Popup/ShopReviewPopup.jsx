import React, { useEffect, useState } from "react";
import axios from "../../../context/configAxios";
import { useNavigate } from "react-router-dom";
import ReviewForEachProduct from "./ReviewForEachProduct";

const ShopReviewPopup = ({ open, onClose, maDonHang }) => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState([]);
  const [openReviewPopup, setOpenReviewPopup] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    if (maDonHang) {
      fetchOrderDetails(maDonHang);
    }
  }, [maDonHang]);

  const fetchOrderDetails = async (maDonHang) => {
    try {
      const response = await axios.get(`/order/details/${maDonHang}`);
      setOrderDetails(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    }
  };

  const fetchReview = async (maSanPham, maDonHang) => {
    try {
      const response = await axios.get(`/review/${maSanPham}/${maDonHang}`);
      if (response.data.length > 0) {
        setSelectedReview(response.data[0]); // Lấy review đầu tiên (nếu có)
        setOpenReviewPopup(true); // Mở popup
      } else {
        alert("Không có đánh giá nào cho sản phẩm này.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
    }
  };

  const handleProductClick = (item) => {
    navigate(`/product/${item.Ma_san_pham}`);
  };

  return (
    open && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-4/5 max-w-4xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Các đánh giá của đơn hàng #{maDonHang}</h2>
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
            >
              Đóng
            </button>
          </div>
          <ul>
            {orderDetails.map((item, index) => (
              <li key={index} className="mb-4 flex items-center border-b pb-4">
                <img
                  src={item.Url_thumbnail || "https://via.placeholder.com/80"}
                  alt={item.Ten_san_pham}
                  onClick={() => handleProductClick(item)}
                  className="w-20 h-20 object-cover mr-4 rounded-md cursor-pointer"
                />
                <div className="ml-4 flex-1">
                  <p
                    className="font-medium text-blue-500 cursor-pointer hover:underline"
                    onClick={() => handleProductClick(item)}
                  >
                    {item.Ten_san_pham}
                  </p>
                  <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                    <p>Giá: {item.Don_gia.toLocaleString()} VND</p>
                    <p>Size: {item.Size}</p>
                    <p>Màu sắc: {item.Mau_sac}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-sm text-gray-700">
                        Số lượng: {item.So_luong}
                      </p>
                      <p className="text-sm font-bold">
                        Thành tiền: {item.Thanh_tien.toLocaleString()} VND
                      </p>
                    </div>
                    {item.Da_danh_gia ? (
                      <button
                        onClick={() =>
                          fetchReview(item.Ma_san_pham, maDonHang)
                        }
                        className="text-yellow-400 font-medium hover:underline"
                      >
                        Xem đánh giá
                      </button>
                    ) : (
                      <span className="text-gray-400">Chưa được đánh giá</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {openReviewPopup && (
          <ReviewForEachProduct
            reviewData={selectedReview}
            onClose={() => setOpenReviewPopup(false)}
          />
        )}
      </div>
    )
  );
};

export default ShopReviewPopup;
