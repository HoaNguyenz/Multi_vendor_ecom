import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {LoginPage, SignupPage, HomePage, 
  ShopDashboardPage, ShopOrdersPage, ShopProductsPage, 
  ShopInfoPage, VerifyPage, ForgotPasswordPage,
ResetPasswordPage, ProfilePage, Cart, SellerSignup, SearchProductPage} from "./Routes.js"
import "./App.css"
import { AuthProvider } from "./context/AuthContext";
import UserRoute from './context/userRoute';
import SellerRoute from './context/sellerRoute';

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
          <Route path='/search' element={<SearchProductPage />} />
          
          {/* Các route yêu cầu đăng nhập */} 
          <Route path='/shop-dashboard' element={<SellerRoute element={<ShopDashboardPage />} />} />
          <Route path='/shop-orders' element={<SellerRoute element={<ShopOrdersPage />} />} />
          <Route path='/shop-products' element={<SellerRoute element={<ShopProductsPage />} />} />
          <Route path='/shop-info' element={<SellerRoute element={<ShopInfoPage />} />} />
          <Route path='/profile' element={<UserRoute element={<ProfilePage />} />} /> 
          <Route path='/sign-up-seller' element={<UserRoute element={<SellerSignup />} />} />
          <Route path='/cart' element={<UserRoute element={<Cart />} />} /> 
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
