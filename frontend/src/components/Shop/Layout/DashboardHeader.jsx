import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { useAuth } from "../../../context/AuthContext"; // Import context
import useLogout from "../../../hooks/useLogout";

const DashboardHeader = () => {
    const { user } = useAuth();  // Lấy thông tin người dùng từ context
    const { logout } = useLogout();
    const [profileMenu, setProfileMenu] = useState(false);

  return (
    <div className="w-full bg-blue-400 h-[60px] flex items-center justify-between px-4">
      {/* Logo */}
      <div className="text-white font-bold text-2xl">
        <Link to="/">LOGO</Link>
      </div>

      {/* Biểu tượng Giỏ hàng, và Profile */}
      <div className="flex items-center space-x-6 text-white">
        <Link to="/cart">
          <AiOutlineShoppingCart size={28} className="cursor-pointer" />
        </Link>

        {/* Biểu tượng Profile */}
        <div className="relative">
          {user ? (
            // Nếu người dùng đã đăng nhập, hiển thị avatar hoặc ảnh đại diện
            <button
              onClick={() => {
                setProfileMenu(!profileMenu);
              }}
              className="focus:outline-none"
            >
              <span className="text-white font-semibold">{user.username}</span>{" "}
              {/* Hiển thị username */}
            </button>
          ) : (
            // Nếu người dùng chưa đăng nhập, hiển thị nút "Đăng nhập"
            <Link to="/login" className="text-white">
              Đăng nhập
            </Link>
          )}

          {/* Menu profile */}
          {profileMenu && (
            <div className="absolute right-0 mt-2 w-[150px] bg-white shadow-lg rounded-md overflow-hidden">
              <Link
                to="/profile"
                className="block text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Hồ sơ cá nhân
              </Link>
              <button
                onClick={logout} // Gọi hàm logout từ context
                className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
