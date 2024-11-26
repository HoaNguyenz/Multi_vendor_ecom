// src/config/axiosConfig.js
import axios from "axios";

// Cấu hình axios
axios.defaults.baseURL = "http://localhost:5000"; // Thay bằng URL backend của bạn
axios.defaults.withCredentials = true; // Gửi cookie kèm theo mỗi request

export default axios;
