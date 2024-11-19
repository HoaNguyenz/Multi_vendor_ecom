import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineSearch,
  AiOutlineBell,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { BiMenuAltLeft } from 'react-icons/bi'
import { IoIosArrowDown } from 'react-icons/io'
import { CgProfile } from "react-icons/cg";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [profileMenu, setProfileMenu] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full bg-blue-400 h-[60px] flex items-center justify-between px-4">
      {/* Logo */}
      <div className="text-white font-bold text-2xl">
        <Link to="/">LOGO</Link>
      </div>

      <div>
        <button className="h-[40px] w-[250px] flex items-center justify-between px-4 bg-white text-lg font-[400] select-none rounded-md">
          <div className="flex items-center">
            <BiMenuAltLeft size={25} className="mr-2" />
            Tất cả danh mục
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
          className="w-full h-[40px] px-4 pr-10 rounded-full border-none focus:outline-none shadow-sm"
        />
        <AiOutlineSearch
          size={20}
          className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
        />
      </div>

      {/* Biểu tượng Thông báo, Giỏ hàng, và Profile */}
      <div className="flex items-center space-x-6 text-white">
        <AiOutlineBell size={28} className="cursor-pointer" />{" "}
        {/* Tăng kích thước lên 28 */}
        <Link to="/cart">
          <AiOutlineShoppingCart size={28} className="cursor-pointer" />{" "}
          {/* Tăng kích thước lên 28 */}
        </Link>
        <div className="relative">
          <button
            onClick={() => setProfileMenu(!profileMenu)}
            className="focus:outline-none"
          >
            <CgProfile size={28} className="cursor-pointer" />{" "}
            {/* Tăng kích thước lên 28 */}
          </button>

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
                onClick={() => {
                  localStorage.removeItem("token"); // Ví dụ xóa token trong localStorage
                  window.location.href = "/login"; // về trang đăng nhập
                }}
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
