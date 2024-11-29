import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const UserRoute = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Không kiểm tra vai trò người bán ở đây, chỉ kiểm tra người dùng đã đăng nhập
  return element;
};

export default UserRoute;
