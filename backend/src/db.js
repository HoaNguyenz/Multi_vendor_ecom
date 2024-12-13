// db.js
const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER, // Lấy từ file .env
  password: process.env.DB_PASSWORD, // Lấy từ file .env
  server: process.env.DB_SERVER, // Lấy từ file .env
  database: process.env.DB_DATABASE, // Lấy từ file .env
  options: {
    encrypt: true, // Nếu sử dụng Azure, bật mã hóa
    trustServerCertificate: true, // Bỏ qua xác thực chứng chỉ
  },
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log("Connected to SQL Server");
  } catch (err) {
    console.error("Lỗi kết nối tới SQL Server:", err);
    throw err;
  }
};

module.exports = { connectDB, sql };
