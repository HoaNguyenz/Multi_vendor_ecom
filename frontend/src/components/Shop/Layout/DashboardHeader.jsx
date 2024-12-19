import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiPackage } from "react-icons/bi";
import { useAuth } from "../../../context/AuthContext"; // Import context
import useLogout from "../../../hooks/useLogout";

const Header = () => {
  const { user, loading } = useAuth(); // Lấy trạng thái loading từ context
  const [profileMenu, setProfileMenu] = useState(false);
  const { logout } = useLogout();
  const [clickedAvatar, setClickedAvatar] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
      const handleClickOutside = (event) => {
        // Kiểm tra xem có phải là nhấp vào avatar không
        if (
          profileMenuRef.current &&
          !profileMenuRef.current.contains(event.target) &&
          !event.target.closest('button')
        ) {
          setProfileMenu(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    

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
      <Link to="/order">
          <BiPackage size={28} className="cursor-pointer" />
        </Link>
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
                setClickedAvatar(true);
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
            <div 
            ref={profileMenuRef}
            className="absolute right-0 mt-2 w-[150px] bg-white shadow-lg rounded-md overflow-hidden z-50">
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
