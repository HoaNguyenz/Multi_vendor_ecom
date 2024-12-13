import React, { useState } from "react";
import axios from "../../../context/configAxios"; // Axios instance

const EditAddressPopup = ({ isOpen, onClose, address, onEdit }) => {
  const [soNha, setSoNha] = useState(address.So_nha || "");
  const [phuongXa, setPhuongXa] = useState(address.Phuong_or_Xa || "");
  const [quanHuyen, setQuanHuyen] = useState(address.Quan_or_Huyen || "");
  const [tinhTP, setTinhTP] = useState(address.Tinh_or_TP || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      so_nha: soNha,
      phuong_or_xa: phuongXa,
      quan_or_huyen: quanHuyen,
      tinh_or_tp: tinhTP,
    };
    try {
      const response = await axios.put(`/address/${address.ID}`, formData);

      if (response.status === 200) {
        onEdit(); // Gọi callback để cập nhật danh sách địa chỉ
        onClose(); // Đóng popup sau khi chỉnh sửa thành công
      }
    } catch (error) {
      console.error("Error editing address:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Thêm địa chỉ mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-500">Số nhà:</label>
            <input
              type="text"
              value={soNha}
              onChange={(e) => setSoNha(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-500">Phường/Xã:</label>
            <input
              type="text"
              value={phuongXa}
              onChange={(e) => setPhuongXa(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-500">Quận/Huyện:</label>
            <input
              type="text"
              value={quanHuyen}
              onChange={(e) => setQuanHuyen(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-500">Tỉnh/Thành phố:</label>
            <input
              type="text"
              value={tinhTP}
              onChange={(e) => setTinhTP(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
            >
              Cập nhật địa chỉ
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAddressPopup;
