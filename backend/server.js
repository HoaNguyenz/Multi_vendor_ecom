const express = require("express");
const cookieParser = require("cookie-parser");
const { connectDB, sql } = require("./db");
const cors = require("cors");
require("dotenv").config();
const { verifyToken, jwtBlacklist } = require("./middleware/verifyToken");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Tăng giới hạn form data
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Địa chỉ frontend
    credentials: true, // Cho phép gửi cookie và thông tin xác thực
  })
);
app.use(authRoutes);
app.use(userRoutes);
app.use(sellerRoutes);
app.use(productRoutes);

const decStrToHex = (str) => BigInt(str).toString(16).toUpperCase();

(async function runServer() {
  try {
    // Kết nối cơ sở dữ liệu
    await connectDB();
    console.log("Connected to SQL Server");

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`Server running on port http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Error connecting to SQL Server:", error.message);
    process.exit(1);
  }
})();
