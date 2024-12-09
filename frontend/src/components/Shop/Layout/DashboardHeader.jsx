import React, { useState} from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useAuth } from "../../../context/AuthContext"; // Import context
import useLogout from "../../../hooks/useLogout";

const Header = () => {
  const { user, loading } = useAuth(); // Lấy trạng thái loading từ context
  const [profileMenu, setProfileMenu] = useState(false);
  const { logout } = useLogout();
 

  if (loading) {
    return <div>Đang tải...</div>; // Hoặc hiển thị spinner
  }

  return (
    <div className="w-full bg-blue-500 h-[60px] flex items-center justify-between px-4 md:px-8">
      {/* Logo */}
      <div className="text-white font-bold text-xl md:text-2xl">
        <Link to="/">LOGO</Link>
      </div>

      {/* Biểu tượng Thông báo, Giỏ hàng, và Profile */}
      <div className="flex items-center md:space-x-6 text-white">
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
              <img
                  src={user.url_avatar}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
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

export default Header;
