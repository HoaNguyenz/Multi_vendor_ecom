import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {LoginPage, SignupPage, HomePage, 
  ShopDashboardPage, ShopOrdersPage, ShopProductsPage, 
  ShopInfoPage, VerifyPage, ForgotPasswordPage,
ResetPasswordPage, ProfilePage, Cart} from "./Routes.js"
import "./App.css"
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from './context/privateRoute.js';

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
          
          {/* Các route yêu cầu đăng nhập */}
          <Route path='/shop-dashboard' element={<PrivateRoute element={<ShopDashboardPage />} />} />
          <Route path='/shop-orders' element={<PrivateRoute element={<ShopOrdersPage />} />} />
          <Route path='/shop-products' element={<PrivateRoute element={<ShopProductsPage />} />} />
          <Route path='/shop-info' element={<PrivateRoute element={<ShopInfoPage />} />} />
          <Route path='/profile' element={<PrivateRoute element={<ProfilePage />} />} /> 
          <Route path='/cart' element={<PrivateRoute element={<Cart />} />} /> 
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
