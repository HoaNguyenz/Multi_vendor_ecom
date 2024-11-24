import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineSearch,
  AiOutlineBell,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import useLogout from "../../hooks/useLogout";
import Cart from "../Cart/Cart"; // Import Cart component

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [profileMenu, setProfileMenu] = useState(false);
  const [categoryMenu, setCategoryMenu] = useState(false);
  const [showCart, setShowCart] = useState(false); // Trạng thái giỏ hàng
  const profileMenuRef = useRef(null);
  const { logout } = useLogout();

  // Danh mục sản phẩm
  const categories = ["Áo sơ mi", "Áo thun", "Quần jeans", "Váy đầm", "Phụ kiện"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenu(false); // Đóng menu nếu click ra ngoài
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    console.log("Tìm kiếm:", searchTerm); // Tích hợp tìm kiếm sản phẩm quần áo
  };

  return (
    <div className="w-full bg-blue-500 h-[60px] flex items-center justify-between px-4 md:px-8">
      {/* Logo */}
      <div className="text-white font-bold text-xl md:text-2xl">
        <Link to="/">LOGO</Link>
      </div>

      {/* Danh mục */}
      <div className="relative">
        <button
          onClick={() => setCategoryMenu(!categoryMenu)}
          className="h-[40px] w-[250px] flex items-center justify-between px-4 bg-white text-lg font-[400] select-none rounded-md"
        >
          <div className="flex items-center">
            <BiMenuAltLeft size={25} className="mr-2" />
            Tất cả danh mục
          </div>
          <IoIosArrowDown size={20} className="ml-2" />
        </button>

        {/* Dropdown danh mục */}
        {categoryMenu && (
          <div className="absolute bg-white shadow-md rounded-md mt-2 w-[250px] z-50">
            {categories.map((category, idx) => (
              <Link
                to={`/category/${category.toLowerCase().replace(" ", "-")}`}
                key={idx}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {category}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Thanh tìm kiếm */}
      <div className="relative w-[70%] max-w-[600px] hidden md:block">
        <input
          type="text"
          placeholder="Tìm sản phẩm bạn muốn..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full h-[40px] px-4 pr-10 rounded-full border-none focus:outline-none shadow-sm"
        />
        <AiOutlineSearch
          size={20}
          onClick={handleSearch}
          className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
        />
      </div>

      {/* Biểu tượng Thông báo, Giỏ hàng, và Profile */}
      <div className="flex items-center space-x-6 text-white">
        {/* Thông báo */}
        <div className="relative cursor-pointer">
          <AiOutlineBell size={28} />
          {/* Badge Thông báo */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-[16px] h-[16px] flex items-center justify-center rounded-full">
            3
          </span>
        </div>

        {/* Giỏ hàng */}
        <Link to="/cart" className="relative">
          {/* Giỏ hàng */}
          <AiOutlineShoppingCart
            size={28}
            className="cursor-pointer"
          />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-[16px] h-[16px] flex items-center justify-center rounded-full">
            2
          </span>
        </Link>

        {/* Profile */}
        <div className="relative cursor-pointer" ref={profileMenuRef}>
          <button
            onClick={() => setProfileMenu(!profileMenu)}
            className="focus:outline-none"
          >
            <CgProfile size={28} className="cursor-pointer" />
          </button>

          {/* Menu Profile */}
          {profileMenu && (
            <div className="absolute right-0 mt-2 w-[150px] bg-white shadow-lg rounded-md overflow-hidden">
              <Link
                to="/profile"
                className="block text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Hồ sơ cá nhân
              </Link>
              <button
                onClick={logout}
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
