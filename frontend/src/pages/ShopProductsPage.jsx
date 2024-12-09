import React from "react";
import DashboardHeader from "../components/Shop/Layout/DashboardHeader";
import DashboardSidebar from "../components/Shop/Layout/DashboardSidebar";
import AllShopProduct from "../components/Shop/AllShopProduct";

const ShopProductsPage = () => {
  return (
    <div>
      <DashboardHeader></DashboardHeader>
      <div className="flex items-center w-full">
        <div className="w-[60px] 1100px:w-[240px] flex-none">
          <DashboardSidebar active={3}></DashboardSidebar>
        </div>

        <div className="w-[75%] justify-center flex flex-1">
          <AllShopProduct></AllShopProduct>

        </div>
      </div>
    </div>
  );
};

export default ShopProductsPage;
