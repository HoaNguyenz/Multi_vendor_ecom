// db.js
const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER, // Tên người dùng
    password: process.env.DB_PASSWORD, // Mật khẩu
    server: process.env.DB_SERVER, // Máy chủ SQL Server
    database: process.env.DB_DATABASE, // Tên cơ sở dữ liệu
    options: {
        encrypt: true, // Bật mã hóa
        trustServerCertificate: true, // Bỏ qua xác thực chứng chỉ
    },
};

const connectDB = async () => {
    try {
        await sql.connect(config);
        console.log("Connected to SQL Server");
    } catch (err) {
        console.error("Database connection failed:", err);
    }
};

module.exports = { connectDB, sql };
