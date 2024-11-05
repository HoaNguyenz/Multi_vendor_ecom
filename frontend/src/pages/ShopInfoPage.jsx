import React from 'react'
import DashboardHeader from "../components/Shop/Layout/DashboardHeader"
import DashboardSidebar from "../components/Shop/Layout/DashboardSidebar"

const ShopInfoPage = () => {
  return (
    <div>
      <DashboardHeader></DashboardHeader>
      <div className='flex items-center justify-between w-full'>
        <div className='w-[60px] 800px:w-[240px]'>
          <DashboardSidebar active = {4}></DashboardSidebar>

        </div>

      </div>
    </div>
  )
}

export default ShopInfoPage