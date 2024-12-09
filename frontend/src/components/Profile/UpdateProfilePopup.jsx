import React, { useState } from "react";
import axios from "../../context/configAxios"; // Axios instance

const UpdateProfilePopup = ({ isOpen, onClose, userInfo, onUpdate }) => {
  const [sdt, setSdt] = useState(userInfo.Sdt || "");
  const [hoVaTen, setHoVaTen] = useState(userInfo.Ho_va_ten || "");
  const [gioiTinh, setGioiTinh] = useState(userInfo.Gioi_tinh || "");
  const [ngaySinh, setNgaySinh] = useState(userInfo.Ngay_sinh || "");
  const [avatar, setAvatar] = useState(null); // Avatar file for preview
  const [avatarURL, setAvatarURL] = useState(userInfo.Url_avatar || ""); // Avatar URL to update
  const [avatarPreview, setAvatarPreview] = useState(null); // Avatar preview

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploadedAvatarURL;

    if (avatar) {
      const fileData = new FormData();
      fileData.append("file", avatar);
      fileData.append("upload_preset", "eCommerce_AvatarPreset"); // Thêm upload preset
      fileData.append("folder", "eCommerce_Avatar");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dlihdjok9/image/upload",
          fileData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: "",
          }
        );

        if (response.status === 200) {
          uploadedAvatarURL = response.data.secure_url; // Lấy URL ảnh đã tải lên
          setAvatarURL(uploadedAvatarURL);
          setAvatar(uploadedAvatarURL);
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
        return; // Dừng lại nếu tải lên thất bại
      }
    }

    const formData = {
      sdt,
      ho_va_ten: hoVaTen,
      gioi_tinh: gioiTinh,
      ngay_sinh: ngaySinh,
      url_avatar: uploadedAvatarURL,
    };

    try {
      const response = await axios.put("/update-user", formData);

      if (response.status === 200) {
        onUpdate(formData);
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update user info:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Cập nhật thông tin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-500">Avatar:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {avatar && (
              <img
                src={avatarPreview}
                alt="Preview"
                className="mt-4 w-20 h-20 rounded-full"
              />
            )}
          </div>
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
              onClick={(e) => setGioiTinh(e.target.value)}
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
