import React, { useState, useEffect } from "react";
import axios from "../../context/configAxios";
import { useAuth } from "../../context/AuthContext";
import Header from "../Layout/Header";
import UpdateProfilePopup from "./UpdateProfilePopup";
const ProfilePage = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Lấy phần yyyy-MM-dd
  };
  const fetchUserInfo = async () => {
    if (!user || !user.username) return;

    try {
      const response = await axios.get(`/get-user-info/${user.username}`);
      const data = response.data;
      if (data.length > 0) {
        setUserInfo(data[0]);
        setAddresses(data);
      }
      setLoading(false);
    } catch (err) {
      setError("Không thể tải thông tin người dùng.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [user]);

  const handleUpdate = async (updatedData) => {
    try {
      // Fetch updated user info from the backend after update
      await fetchUserInfo(); // Refetch user data from the server
    } catch (err) {
      console.error("Cập nhật thông tin thất bại:", err);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Header />

      <div className="w-[90%] md:w-[70%] lg:w-[50%] bg-white mt-10 p-6 rounded-lg shadow-lg mx-auto">
        <h1 className="text-2xl font-bold mb-2">
          Hồ sơ của {userInfo.Username}
        </h1>
        <p className="text-gray-500 mb-6">Thông tin cá nhân và địa chỉ</p>

        <div className="space-y-4">
          <div className="flex items-center">
            <img
              src={userInfo.Url_avatar || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-2 border-gray-300 mr-4"
            />
          </div>
          <div className="mt-6">
            <div className="mb-4">
              <p className="text-gray-500 text-sm">Số điện thoại:</p>
              <p className="text-gray-900 font-medium">{userInfo.Sdt}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-500 text-sm">Email:</p>
              <p className="text-gray-900 font-medium">{userInfo.Email}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-500 text-sm">Họ và tên:</p>
              <p className="text-gray-900 font-medium">
                {userInfo.Ho_va_ten || "Chưa cập nhật"}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-gray-500 text-sm">Giới tính:</p>
              <p className="text-gray-900 font-medium">
                {userInfo.Gioi_tinh === "M"
                  ? "Nam"
                  : userInfo.Gioi_tinh === "F"
                  ? "Nữ"
                  : "Chưa cập nhật"}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-gray-500 text-sm">Ngày sinh:</p>
              <p className="text-gray-900 font-medium">
                {formatDate(userInfo.Ngay_sinh) || "Chưa cập nhật"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Danh sách địa chỉ</h2>
          {addresses.length > 0 ? (
            <ul>
              {addresses.map((address, index) => (
                <li key={index} className="mb-4">
                  <p className="text-gray-500 text-sm">Địa chỉ {index + 1}:</p>
                  <p className="text-gray-900 font-medium">
                    {`${address.So_nha}, ${address.Phuong_or_Xa}, ${address.Quan_or_Huyen}, ${address.Tinh_or_TP}`}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Không có địa chỉ nào.</p>
          )}
        </div>

        <button
          onClick={() => setIsPopupOpen(true)}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Cập nhật thông tin
        </button>
      </div>

      {/* Popup Update Profile */}
      <UpdateProfilePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        userInfo={userInfo}
        onUpdate={handleUpdate}
      ></UpdateProfilePopup>
    </div>
  );
};

export default ProfilePage;
