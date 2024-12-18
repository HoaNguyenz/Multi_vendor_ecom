import React from "react";
import Header from "../components/Layout/Header";
import ShopOfProduct from "../components/Product/ShopOfProduct";
const ShopOfProductsPage = () => {
  return (
    <div>
      <Header></Header>
      <div className="flex w-full">
        <div className="flex-1 p-5">
          <ShopOfProduct />
        </div>
      </div>
    </div>
  );
};

export default ShopOfProductsPage;
