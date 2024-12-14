import React, { useEffect, useState } from 'react';
import axios from "../../context/configAxios"; // Thư viện axios để gọi API

const DetailsPopup = ({ open, onClose, maDonHang }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  
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

  return (
    open && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-4/5 max-w-3xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Chi tiết đơn hàng #{maDonHang}</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
          >
            Đóng
          </button>
          <div>
            <h3 className="text-xl font-semibold mb-2">Sản phẩm trong đơn hàng:</h3>
            <ul>
              {orderDetails.map((item, index) => (
                <li key={index} className="mb-4">
                  <p><strong>Tên sản phẩm:</strong> {item.Ten_san_pham}</p>
                  <p><strong>Số lượng:</strong> {item.So_luong}</p>
                  <p><strong>Giá:</strong> {item.Gia.toLocaleString()} VND</p>
                  <p><strong>Thành tiền:</strong> {(item.Gia * item.So_luong).toLocaleString()} VND</p>
                  <hr className="my-2" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  );
};

export default DetailsPopup;
