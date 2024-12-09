import React, { useState } from "react";
import axios from "../../../context/configAxios"; // Axios instance

const EditShopInfo = ({ isOpen, onClose, shopInfo, onUpdate }) => {
  const [sdt, setSdt] = useState(shopInfo.Sdt || "");
  const [logo, setLogo] = useState(null); // Avatar file for preview
  const [logoURL, setLogoURL] = useState(shopInfo.Url_logo || ""); // Avatar URL to update
  const [logoPreview, setLogoPreview] = useState(null); // Avatar preview
  const [tenShop, setTenShop] = useState(shopInfo.Ten || "");
  const [moTa, setMoTa] = useState(shopInfo.Mo_ta || "");

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let uploadedLogoURL = logoURL; // Giữ nguyên URL logo hiện tại
  
    if (logo) {
      const fileData = new FormData();
      fileData.append("file", logo);
      fileData.append("upload_preset", "eCommerce_LogoPreset");
      fileData.append("folder", "eCommerce_Logo");
  
      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dlihdjok9/image/upload",
          fileData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: "",
          }

        );
  
        if (response.status === 200) {
          uploadedLogoURL = response.data.secure_url;
        }
      } catch (error) {
        console.error("Error uploading logo:", error);
        return;
      }
    }
  
    // Dữ liệu cập nhật
    const formData = {
      Ten: tenShop,
      Mo_ta: moTa,
      Url_logo: uploadedLogoURL, // Thêm logic cập nhật địa chỉ nếu cần
    };
  
    try {
      const response = await axios.put("/update-shop", formData);
  
      if (response.status === 200) {
        const updatedData = await axios.get("/seller-info");
        onUpdate(updatedData.data); // Trả dữ liệu đầy đủ về onUpdate
      }
    } catch (error) {
      console.error("Error updating shop info:", error);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Cập nhật thông tin cửa hàng</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-500">Logo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {logo && <img src={logoPreview} alt="Preview" className="mt-4 w-20 h-20 rounded-full" />}
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-500">Tên cửa hàng:</label>
            <input
              type="text"
              value={tenShop}
              onChange={(e) => setTenShop(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-500">Mô tả:</label>
            <input
              type="text"
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
            </input>
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

export default EditShopInfo;
