import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const SellerRoute = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Kiểm tra nếu người dùng là người bán
  if (user.la_nguoi_ban !== true) {
    return <Navigate to="/" />;
  }

  return element;
};

export default SellerRoute;
