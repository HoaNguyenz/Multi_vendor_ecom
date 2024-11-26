import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { useAuth } from "../../context/AuthContext"; // Import context
import useLogout from "../../hooks/useLogout";


const Header = () => {
  const { user, loading } = useAuth(); // Lấy trạng thái loading từ context
  const [profileMenu, setProfileMenu] = useState(false);
  const { logout } = useLogout();
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) {
    return <div>Đang tải...</div>; // Hoặc hiển thị spinner
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full bg-blue-400 h-[60px] flex items-center justify-between px-4">
      {/* Logo */}
      <div className="text-white font-bold text-2xl">
        <Link to="/">LOGO</Link>
      </div>

      {/* Category */}
      <div>
        <button className="h-[6vh] w-[20vw] items-center justify-between px-4 bg-white text-lg font-[400] select-none rounded-md hidden md:flex">
          <div className="flex items-center">
            <BiMenuAltLeft size={25} className="mr-2" />
            <span className="text-base md:text-sm lg:text-base">Tất cả danh mục</span>
          </div>
          <IoIosArrowDown size={20} className="ml-2" />
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="relative w-[50%] max-w-[600px]">
        <input
          type="text"
          placeholder="Bạn muốn tìm gì..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full h-[6vh] px-4 pr-10 rounded-full border-none focus:outline-none shadow-sm"
        />
        <AiOutlineSearch
          size={20}
          className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
        />
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
            <button onClick={() => { setProfileMenu(!profileMenu)}} className="focus:outline-none">
              <span className="text-white font-semibold">{user.username}</span> {/* Hiển thị username */}
            </button>
          ) : (
            // Nếu người dùng chưa đăng nhập, hiển thị nút "Đăng nhập"
            <Link to="/login" className="text-white">Đăng nhập</Link>
          )}

          {/* Menu profile */}
          {profileMenu && (
            <div className="absolute right-0 mt-2 w-[150px] bg-white shadow-lg rounded-md overflow-hidden">
              <Link to="/profile" className="block text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Hồ sơ cá nhân
              </Link>
              <Link to="/shop-dashboard" className="block text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Cửa hàng của tôi
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
