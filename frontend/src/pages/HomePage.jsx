import React from 'react'
import Header from "../components/Layout/Header.jsx"
import Categories from "../components/Route/Categories/Categories.jsx"
import BestDeals from "../components/Route/BestDeals/BestDeals.jsx"

const HomePage = () => {
  return (
    <div>
      <Header></Header>
      <Categories/>
      <BestDeals/>
    </div>
  )
}

export default HomePage