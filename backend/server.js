// server.js
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
app.use(express.json());
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


app.get("/testAPI", verifyToken, async (req, res) => {
  try {
    const kq = await sql.query`SELECT * FROM Nguoi_dung_va_Gio_hang`;

    // let id = snowflake.generate();
    // console.log(id);
    // console.log(decStrToHex(id));

    // for (let i = 0; i < 10; i++) {
    //   let id = snowflake.generate();
    //   console.log(id);
    // }

    // console.log(req.user);

    // console.log(kq);
    // cons
    // await sql.query`INSERT INTO Dia_chi(ID) VALUES (${snowflake.generate()})`;
    res.status(200).json(kq.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin sản phẩm.", error });
  }
});

// Route: Get List Product Seller
// app.get("/product-seller", verifyToken, async (req, res) => {
//   const Sdt = req.user.id;

//   try {
//     const result = await sql.query`
//             SELECT * FROM San_pham WHERE Ma_cua_hang = (SELECT Ma_cua_hang FROM Nguoi_ban_va_Cua_hang WHERE Sdt = ${Sdt})
//         `;

//     const products = result.recordset;

//     if (products.length === 0) {
//       return res.status(404).json({ message: "Không có sản phẩm nào." });
//     }

//     res.status(200).json(products);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Lỗi khi lấy danh sách sản phẩm.",
//       error: error.message,
//     });
//   }
// });


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
