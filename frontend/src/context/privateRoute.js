import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ element }) => {
  const { user, loading } = useAuth();
  
console.log("User in PrivateRoute:", user);
console.log("Loading status:", loading);


  if (loading) {
    // Có thể thêm loading spinner hoặc gì đó khi trạng thái đang được kiểm tra
    return <div>Loading...</div>;
  }

  if (!user) {
    // Nếu chưa đăng nhập, điều hướng đến trang login
    return <Navigate to="/login" />;
  }

  return element;
};

export default PrivateRoute;
