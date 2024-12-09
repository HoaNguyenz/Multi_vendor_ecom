import React from 'react'
import DashboardHeader from "../components/Shop/Layout/DashboardHeader"
import DashboardSidebar from "../components/Shop/Layout/DashboardSidebar"


const ShopDashboardPage = () => {
  return (
    <div>
      <DashboardHeader></DashboardHeader>
      <div className='flex items-center justify-between w-full'>
        <div className='w-[60px] 1100px:w-[240px]'>
          <DashboardSidebar active = {1}></DashboardSidebar>

        </div>

      </div>
    </div>
  )
}

export default ShopDashboardPage