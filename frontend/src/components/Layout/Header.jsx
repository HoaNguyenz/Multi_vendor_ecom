import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useNavigate
import { AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BiMenuAltLeft, BiLogIn } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { useAuth } from "../../context/AuthContext"; // Import context
import useLogout from "../../hooks/useLogout";
import axios from "../../context/configAxios";

const Header = () => {
  const { user, loading } = useAuth();
  const [profileMenu, setProfileMenu] = useState(false);
  const [categoryMenu, setCategoryMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useLogout();

  //get categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/get-categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("keyword") || "");
    setCategory(params.get("category") || "");
  }, [location.search]);

  //handle click outside profile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //handle click outside category
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target)
      ) {
        setCategoryMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    navigate(`/search?keyword=${searchTerm}&category=${category}`);
    window.location.reload();
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Hàm xử lý khi chọn category
  const handleCategorySelect = (categoryItem) => {
    if (categoryItem === "Tất cả danh mục") {
      setCategory(""); // Reset category nếu chọn "Tất cả danh mục"
    } else {
      setCategory(categoryItem);
    }
    setCategoryMenu(false); // Đóng menu sau khi chọn
  };

  return (
    <div className="w-full bg-blue-500 h-[60px] flex items-center justify-between px-4 md:px-8">
      <div className="text-white font-bold text-xl md:text-2xl">
        <Link to="/">LOGO</Link>
      </div>

      <div className="relative hidden md:block">
        <button
          onClick={() => setCategoryMenu(!categoryMenu)}
          className="h-[6vh] w-[20vw] flex items-center justify-between px-4 bg-white text-lg font-[400] select-none rounded-md"
        >
          <div className="flex items-center">
            <BiMenuAltLeft size={25} className="mr-2" />
            <span className="md:text-sm lg:text-lg">
              {category || "Tất cả danh mục"}
            </span>
          </div>
          <IoIosArrowDown size={20} className="ml-2" />
        </button>
        {categoryMenu && (
          <div
            className="absolute bg-white shadow-md rounded-md mt-2 w-[20vw] z-50"
            ref={categoryMenuRef}
          >
            {categories.map((categoryItem, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCategory(categoryItem);
                  setCategoryMenu(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full rounded-md text-left"
              >
                {categoryItem}
              </button>
            ))}
            <button
              onClick={() => handleCategorySelect("Tất cả danh mục")}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full rounded-md text-left"
            >
              Tất cả danh mục
            </button>
          </div>
        )}
      </div>

      {/* Search bar */}
      <div className="relative w-[60%] max-w-[600px]">
        <input
          type="text"
          placeholder="Tìm sản phẩm bạn muốn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full h-[6vh] px-4 pr-10 rounded-full border-none focus:outline-none shadow-sm"
        />
        <AiOutlineSearch
          size={20}
          onClick={handleSearch}
          className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
        />
      </div>

      {/* User avatar/ Login Button */}
      <div className="flex items-center md:space-x-6 text-white">
        <Link to="/cart">
          <AiOutlineShoppingCart size={28} className="cursor-pointer" />
        </Link>
        <div className="relative">
          {user ? (
            <button
              onClick={() => setProfileMenu(!profileMenu)}
              className="focus:outline-none"
            >
              {user.url_avatar ? (
                <img
                  src={user.url_avatar}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full cursor-pointer" // Tùy chỉnh kích thước và kiểu dáng
                />
              ) : (
                <CgProfile size={28} className="cursor-pointer" />
              )}
            </button>
          ) : (
            <Link to="/login">
              <BiLogIn
                size={28}
                className="block md:hidden text-white"
              ></BiLogIn>
              <span className="hidden md:block bg-white text-blue-500 font-semibold py-2 px-4 rounded-md hover:bg-blue-100 transition-all duration-300 shadow-md">
                Đăng nhập
              </span>
            </Link>
          )}
          {/* Menu profile */}
          {profileMenu && (
            <div
              ref={profileMenuRef}
              className="absolute right-0 mt-2 w-[150px] bg-white shadow-lg rounded-md overflow-hidden z-50"
            >
              <Link
                to="/profile"
                className="block text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Hồ sơ cá nhân
              </Link>

              {user && user.la_nguoi_ban === true && (
                <Link
                  to="/shop-dashboard"
                  className="block text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cửa hàng của tôi
                </Link>
              )}

              {user.la_nguoi_ban === false && (
                <Link
                  to="/sign-up-seller"
                  className="block text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Đăng ký làm người bán
                </Link>
              )}

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
