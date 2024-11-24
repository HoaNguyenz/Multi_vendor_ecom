import React from "react";
import { AiOutlineBell, AiOutlineShoppingCart } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const userInfo = {
    name: "Consumer",
    email: "consumer@gmail.com",
    phone: "0123456789",
    address: "123 Đường ABC, Thành phố XYZ",
    avatar: "https://via.placeholder.com/150", // Đường dẫn avatar mặc định
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Header */}
      <div className="w-full bg-blue-500 h-[60px] flex items-center justify-between px-8">
        <div className="text-white font-bold text-xl">
          <Link to="/">LOGO</Link>
        </div>
        <div className="flex items-center space-x-6 text-white">
          {/* Thông báo */}
          <div className="relative cursor-pointer">
            <AiOutlineBell size={28} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-[16px] h-[16px] flex items-center justify-center rounded-full">
              3
            </span>
          </div>

          {/* Giỏ hàng */}
          <div className="relative cursor-pointer">
            <AiOutlineShoppingCart size={28} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-[16px] h-[16px] flex items-center justify-center rounded-full">
              5
            </span>
          </div>

          {/* Hồ sơ */}
          <div className="relative cursor-pointer">
            <CgProfile size={28} />
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="w-[90%] md:w-[70%] lg:w-[50%] bg-white mt-10 p-6 rounded-lg shadow-lg mx-auto">
        <h1 className="text-2xl font-bold mb-2">Consumer's Profile</h1>
        <p className="text-gray-500 mb-6">Xem và cập nhật thông tin cá nhân</p>

        {/* Avatar và thông tin */}
        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center">
            <img
              src={userInfo.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-2 border-gray-300 mr-4"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
              Chỉnh sửa
            </button>
          </div>

          {/* Info Rows */}
          <div className="mt-6">
            <div className="mb-4">
              <p className="text-gray-500 text-sm">Tên:</p>
              <p className="text-gray-900 font-medium">{userInfo.name}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-500 text-sm">Email:</p>
              <p className="text-gray-900 font-medium">{userInfo.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-500 text-sm">Số điện thoại:</p>
              <p className="text-gray-900 font-medium">{userInfo.phone}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-500 text-sm">Địa chỉ:</p>
              <p className="text-gray-900 font-medium">{userInfo.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
