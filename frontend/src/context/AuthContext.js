import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "./configAxios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Trạng thái người dùng
  const [loading, setLoading] = useState(true); // Trạng thái loading

  // Hàm login sẽ được gọi sau khi người dùng đăng nhập thành công
  const login = (userData) => {
    setUser(userData);
  };

  // Khi ứng dụng khởi chạy, kiểm tra xem người dùng đã đăng nhập chưa
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get("/authenticate");
        setUser({
          username: response.data.username,
          email: response.data.email,
          la_nguoi_ban: response.data.la_nguoi_ban,
          sdt: response.data.sdt,
          url_avatar: response.data.url_avatar
        });
      } catch (error) {
        setUser(null); // Nếu lỗi, coi như chưa đăng nhập
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    };

    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, loading }}>
      {!loading && children} {/* Chỉ render children khi trạng thái loading hoàn tất */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
