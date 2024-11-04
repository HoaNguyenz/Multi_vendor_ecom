import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {LoginPage, SignupPage, HomePage, ShopOverviewPage} from "./Routes.js"
import "./App.css"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/sign-up' element={<SignupPage/>}></Route>
        <Route path='/home' element={<HomePage/>}></Route>
        <Route path='/shop-overview' element={<ShopOverviewPage/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App