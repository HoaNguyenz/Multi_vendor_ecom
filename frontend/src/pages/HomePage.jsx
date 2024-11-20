import React from 'react'
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero.jsx";
//import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
//import Events from "../components/Events/Events";
//import Sponsored from "../components/Route/Sponsored";
//import Footer from "../components/Layout/Footer";
import Categories from "../components/Route/Categories/Categories.jsx"
import BestDeals from "../components/Route/BestDeals/BestDeals.jsx"

const HomePage = () => {
  return (
    <div>
      <Header activeHeading={1} />
      <Hero />
      <Categories/>
      <BestDeals/>
    </div>
  )
}

export default HomePage