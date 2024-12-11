import React from 'react';
import DashboardHeader from '../components/Shop/Layout/DashboardHeader';
import DashboardSidebar from '../components/Shop/Layout/DashboardSidebar';
import Dashboard from '../components/Shop/DashBoard';

const ShopDashboardPage = () => {
  return (
    <div>
      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-[60px] 1100px:w-[240px] flex-shrink-0">
          <DashboardSidebar active={1} />
        </div>

        {/* Dashboard (fills remaining space) */}
        <div className="flex-grow">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default ShopDashboardPage;
