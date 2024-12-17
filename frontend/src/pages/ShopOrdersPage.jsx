import React from "react";
import DashboardHeader from "../components/Shop/Layout/DashboardHeader";
import DashboardSidebar from "../components/Shop/Layout/DashboardSidebar";
import ShopOrders from "../components/Shop/ShopOrders";

const ShopOrdersPage = () => {
  return (
    <div>
      <DashboardHeader></DashboardHeader>
      <div className="flex items-center justify-between w-full">
        <div className="w-[60px] 1100px:w-[240px]">
          <DashboardSidebar active={2}></DashboardSidebar>
        </div>
        <div className="w-[75%] justify-center flex flex-1">
          <ShopOrders></ShopOrders>
        </div>
      </div>
    </div>
  );
};

export default ShopOrdersPage;
