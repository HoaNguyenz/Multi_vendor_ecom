import React from "react";
import DashboardHeader from "../components/Shop/Layout/DashboardHeader";
import DashboardSidebar from "../components/Shop/Layout/DashboardSidebar";
import ShopInfo from "../components/Shop/ShopInfo";

const ShopInfoPage = () => {
  return (
    <div>
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <div className="flex w-full">
        {/* Sidebar (bên trái) */}
        <div className="w-[60px] 800px:w-[240px]">
          <DashboardSidebar active={4} />
        </div>

        {/* Shop Info (bên phải) */}
        <div className="flex-1 bg-gray-50 p-5">
          <ShopInfo isOwner={true} />
        </div>
      </div>
    </div>
  );
};

export default ShopInfoPage;
