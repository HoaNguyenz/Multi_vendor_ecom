import React from 'react';
import Header from '../components/Layout/Header';
import OrderDetails from '../components/Order/OrderDetails';

const OrderPage = () => {
  return (
    <div className="flex flex-col items-center space-y-4"> {/* Tăng khoảng cách giữa các phần tử con */}
      <Header />
      <OrderDetails />
    </div>
  );
};

export default OrderPage;
