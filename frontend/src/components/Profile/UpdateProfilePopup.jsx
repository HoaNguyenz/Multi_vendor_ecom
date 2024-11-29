import React, { useState } from "react";
import axios from "../../context/configAxios"; // Thư viện gọi API

const UpdateProfilePopup = ({ isOpen, onClose, userInfo, onUpdate }) => {
  // Declare individual state variables for each input field
  const [sdt, setSdt] = useState(userInfo.Sdt || "");
  const [hoVaTen, setHoVaTen] = useState(userInfo.Ho_va_ten || "");
  const [gioiTinh, setGioiTinh] = useState(userInfo.Gioi_tinh || "");
  const [ngaySinh, setNgaySinh] = useState(userInfo.Ngay_sinh || "");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the data to be sent in the API request
      const formData = {
        sdt: sdt,
        ho_va_ten: hoVaTen,
        gioi_tinh: gioiTinh,
        ngay_sinh: ngaySinh,
      };
      console.log(formData);
      // Call API to update user info
      const response = await axios.put("/update-user", formData);

      if (response.status === 200) {
        onUpdate(formData); // Update the user info in the app state
        onClose(); // Close the popup
      }
    } catch (error) {
      console.error("Cập nhật thông tin thất bại:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Cập nhật thông tin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-500">Họ và tên:</label>
            <input
              type="text"
              value={hoVaTen}
              onChange={(e) => setHoVaTen(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-500">Giới tính:</label>
            <select
              value={gioiTinh}
              onChange={(e) => setGioiTinh(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="M">Nam</option>
              <option value="F">Nữ</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-500">Ngày sinh:</label>
            <input
              type="date"
              value={ngaySinh}
              onChange={(e) => setNgaySinh(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
            >
              Cập nhật
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

export default UpdateProfilePopup;
