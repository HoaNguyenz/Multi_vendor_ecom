import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineQueryStats } from "react-icons/md";
import { BsBoxSeam, BsShop } from "react-icons/bs";
import { IoShirtOutline } from "react-icons/io5";

const DashboardSidebar = ({ active }) => {
  return (
    <div className="w-full h-[100vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10 no-scrollbar">
      <div
        className={`w-full flex items-center p-4 ${
          active === 1 ? "bg-[#1E90FF] bg-opacity-50" : "bg-white"
        }`}
      >
        <Link
          to="/shop-dashboard"
          className="w-full flex items-center"
        >
          <MdOutlineQueryStats size={25} color="black"></MdOutlineQueryStats>
          <h5 className="hidden 800px:block pl-2 text-[18px] font-[450]">Thống kê</h5>
        </Link>
      </div>

      <div
        className={`w-full flex items-center p-4 ${
          active === 2 ? "bg-[#1E90FF] bg-opacity-50" : "bg-white"
        }`}
      >
        <Link
          to="/shop-orders"
          className="w-full flex items-center"
        >
          <BsBoxSeam size={25} color="black"></BsBoxSeam>
          <h5 className="hidden 800px:block pl-2 text-[18px] font-[450]">Quản lí đơn hàng</h5>
        </Link>
      </div>

      <div
        className={`w-full flex items-center p-4 ${
          active === 3 ? "bg-[#1E90FF] bg-opacity-50" : "bg-white"
        }`}
      >
        <Link
          to="/shop-products"
          className="w-full flex items-center"
        >
          <IoShirtOutline size={25} color="black"></IoShirtOutline>
          <h5 className="hidden 800px:block pl-2 text-[18px] font-[450]">Quản lí sản phẩm</h5>
        </Link>
      </div>

      <div
        className={`w-full flex items-center p-4 ${
          active === 4 ? "bg-[#1E90FF] bg-opacity-50" : "bg-white"
        }`}
      >
        <Link
          to="/shop-info"
          className="w-full flex items-center"
        >
          <BsShop size={25} color="black"></BsShop>
          <h5 className="hidden 800px:block pl-2 text-[18px] font-[450]">Thông tin cửa hàng</h5>
        </Link>
      </div>
    </div>
  );
};

export default DashboardSidebar;
