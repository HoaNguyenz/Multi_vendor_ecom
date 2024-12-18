import React, { useEffect, useState } from "react";
import axios from "../../../context/configAxios";
import ReviewPopup from "../../Order/ReviewPopup";
import { useNavigate } from "react-router-dom";

const ShopOrderDetailsPopup = ({ open, onClose, maDonHang, trangThaiDonHang }) => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState([]);
  const [soNha, setSoNha] = useState("");
  const [phuongXa, setphuongXa] = useState("");
  const [quanHuyen, setQuanHuyen] = useState("");
  const [tinhTp, setTinhTp] = useState("");
  const [sdt, setSdt] = useState("");
  const [phiGiaoHang, setPhiGiaoHang] = useState(0);

  useEffect(() => {
    if (maDonHang) {
      fetchOrderDetails(maDonHang);
    }
  }, [maDonHang]);

  const fetchOrderDetails = async (maDonHang) => {
    try {
      const response = await axios.get(`/order/details/${maDonHang}`);
      const details = response.data;
      setOrderDetails(details);
      setSoNha(details[0].So_nha);
      setphuongXa(details[0].Phuong_or_Xa);
      setQuanHuyen(details[0].Quan_or_Huyen);
      setTinhTp(details[0].Tinh_or_TP);
      setSdt(details[0].Sdt);
      setPhiGiaoHang(details[0].Phi_giao_hang);
      console.log(details);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    }
  };

  const handleProductClick = (item) => {
    navigate(`/product/${item.Ma_san_pham}`);
  };

  // Tính tổng tiền của toàn bộ đơn hàng
  const calculateTotalAmount = () => {
    return orderDetails.reduce((total, item) => total + item.Thanh_tien, 0);
  };

  return (
    open && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-4/5 max-w-4xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Chi tiết đơn hàng #{maDonHang}
            </h2>
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
            >
              Đóng
            </button>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Sản phẩm trong đơn hàng:
            </h3>
            <ul>
              {orderDetails.map((item, index) => (
                <li
                  key={index}
                  className="mb-4 flex items-center border-b pb-4"
                >
                  <img
                    src={item.Url_thumbnail || "https://via.placeholder.com/80"}
                    alt={item.Ten_san_pham}
                    onClick={() => handleProductClick(item)}
                    className="w-20 h-20 object-cover mr-4 rounded-md border border-gray-300 cursor-pointer"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <p
                        className="font-medium text-blue-500 cursor-pointer hover:underline"
                        onClick={() => handleProductClick(item)}
                      >
                        {item.Ten_san_pham}
                      </p>
                      <p className="text-md font-medium text-blue-500 cursor-pointer hover:underline mr-2">
                      {item.Ten_cua_hang}
                      </p>
                    </div>
                    
                    <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                      <p>Giá: {item.Don_gia.toLocaleString()} VND</p>
                      <p>Size: {item.Size}</p>
                      <p>Màu sắc: {item.Mau_sac}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <p className="text-sm text-gray-700">
                          Số lượng: {item.So_luong}
                        </p>
                        <p className="ml-4 text-sm font-bold">
                          Thành tiền: {item.Thanh_tien.toLocaleString()} VND
                        </p>
                      </div>
                      {trangThaiDonHang === "Đã giao thành công" && (
                        <div className="flex items-center">
                          {item.Da_danh_gia ? (
                            <span className="text-yellow-400 font-medium mr-2">
                              Đã đánh giá
                            </span>
                          ) : (
                            <span
                              className="text-gray-500 mr-2"
                            >
                              Sản phẩm chưa được đánh giá
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Tổng cộng tiền */}
          <div className="bg-white p-4 mt-6 rounded-md shadow-md">
            <div className="flex flex-col text-gray-700">
              {/* Dòng địa chỉ */}
              <div className="flex justify-between mb-2">
                <span className="font-medium">Địa chỉ:</span>
                <span>
                  {soNha}, {phuongXa},{" "}
                  {quanHuyen}, {tinhTp}
                </span>
              </div>

              {/* Dòng số điện thoại */}
              <div className="flex justify-between mb-2">
                <span className="font-medium">Số điện thoại:</span>
                <span>{sdt}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="font-medium">Phương thức vận chuyển:</span>
                <span>
                  {phiGiaoHang === 45000
                    ? "Hỏa tốc"
                    : phiGiaoHang === 30000
                    ? "Nhanh"
                    : "Tiết kiệm"}
                </span>
              </div>

              <div className="flex justify-between border-t pt-4 mt-2 mb-2">
                <span className="font-medium">Phí giao hàng:</span>
                <span>
                  {phiGiaoHang.toLocaleString()} VND
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Tổng tiền hàng:</span>
                <span>{calculateTotalAmount().toLocaleString()} VND</span>
              </div>

              {/* Dòng tổng cộng */}
              <div className="flex justify-end items-center pt-4 mt-2">
                <p className="text-lg font-semibold mr-4">Tổng cộng:</p>
                <p className="text-lg font-bold text-red-500">
                  {(
                    calculateTotalAmount() +
                    (phiGiaoHang)
                  ).toLocaleString()}{" "}
                  VND
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ShopOrderDetailsPopup;
