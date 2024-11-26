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
        <Route path='/login' element={<LoginPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/sign-up' element={<SignupPage />} />
        <Route path='/verify' element={<VerifyPage />} />
        <Route path='/' element={<HomePage />} />
        <Route path='/shop-dashboard' element={<ShopDashboardPage />} />
        <Route path='/shop-orders' element={<ShopOrdersPage />} />
        <Route path='/shop-products' element={<ShopProductsPage />} />
        <Route path='/shop-info' element={<ShopInfoPage />} />
        <Route path='/profile' element={<ProfilePage />} /> 
        <Route path='/cart' element={<Cart />} /> 
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
