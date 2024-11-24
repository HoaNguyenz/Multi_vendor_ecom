import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  LoginPage,
  SignupPage,
  HomePage,
  ShopDashboardPage,
  ShopOrdersPage,
  ShopProductsPage,
  ShopInfoPage,
  VerifyPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from './Routes.js';
import ProfilePage from './components/Home/ProfilePage'; 
import Cart from './components/Cart/Cart'; 
import './App.css';

const App = () => {
  return (
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
  );
};

export default App;
