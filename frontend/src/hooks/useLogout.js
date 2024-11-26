import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import axios from "../context/configAxios"; 

const useLogout = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Lấy hàm cập nhật trạng thái người dùng từ context

  const logout = async () => {
    try {
      // Gửi yêu cầu logout đến backend bằng axios
      const response = await axios.post("/logout");

      if (response.status === 200) {
        console.log("Logout successful");
        setUser(null); // Xóa trạng thái người dùng trong context
        navigate("/login"); // Chuyển hướng về trang đăng nhập
      } else {
        console.error("Logout failed:", response.data?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error during logout:", error.response?.data?.message || error.message);
    }
  };

  return { logout };
};

export default useLogout;
