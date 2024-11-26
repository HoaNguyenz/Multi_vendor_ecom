import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {LoginPage, SignupPage, HomePage, 
  ShopDashboardPage, ShopOrdersPage, ShopProductsPage, 
  ShopInfoPage, VerifyPage, ForgotPasswordPage,
ResetPasswordPage} from "./Routes.js"
import "./App.css"
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/forgot-password' element={<ForgotPasswordPage/>}></Route>
        <Route path='/reset-password' element={<ResetPasswordPage/>}></Route>
        <Route path='/sign-up' element={<SignupPage/>}></Route>
        <Route path='/verify' element={<VerifyPage/>}></Route>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/shop-dashboard' element={<ShopDashboardPage/>}></Route>
        <Route path='/shop-orders' element={<ShopOrdersPage/>}></Route>
        <Route path='/shop-products' element={<ShopProductsPage/>}></Route>
        <Route path='/shop-info' element={<ShopInfoPage/>}></Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App