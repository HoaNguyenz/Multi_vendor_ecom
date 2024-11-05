import React from 'react'
// import {useSelector} from 'react-redux'
import { Link } from "react-router-dom";

const DashboardHeader = () => {
    //const {seller} = useSelector((state) => state.seller);
  return (
    <div className='w-full h-[60px] bg-[#1E90FF] bg-opacity-70 shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4'>
        <div>
            <Link to = "/home">
            <img src="" alt="" />
            </Link>
        </div>
        
        <div className='flex items-center'>
            <div className='flex items-center mr-4'>
                avatar

            </div>

        </div>
    </div>
    
  )
}

export default DashboardHeader