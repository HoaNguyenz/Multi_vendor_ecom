// server.js
const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { connectDB, sql } = require("./db");
const cors = require("cors");
require("dotenv").config();
const { SnowflakeId } = require("@akashrajpurohit/snowflake-id");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Địa chỉ frontend
    credentials: true, // Cho phép gửi cookie và thông tin xác thực
  })
);

const workerId = process.pid % 1024;
const snowflake = SnowflakeId({ workerId });

const decStrToHex = (str) => BigInt(str).toString(16).toUpperCase();

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Utility functions
const sendVerificationEmail = async (email, verificationCode) => {
  await transporter.sendMail({
    to: email,
    subject: "Verify your account",
    html: `Your verification code is: <strong>${verificationCode}</strong>`,
  });
};

// Blacklist to store invalidated JWTs
const jwtBlacklist = new Set();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
  if (!token || jwtBlacklist.has(token)) {
    return res
      .status(401)
      .json({ message: "Bạn cần đăng nhập để thực hiện chức năng này." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};

// Route: Sign Up
app.post("/sign-up", async (req, res) => {
  const { username, email, sdt, mat_khau, xac_nhan_mat_khau } = req.body;

  // Kiểm tra mật khẩu có khớp hay không
  if (mat_khau !== xac_nhan_mat_khau) {
    return res
      .status(400)
      .json({ message: "Mật khẩu và xác nhận mật khẩu không khớp." });
  }

  const hashedPassword = await bcrypt.hash(mat_khau, 10);
  const verificationCode = Math.floor(100000 + Math.random() * 900000); // Tạo mã xác minh 6 chữ số

  try {
    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser =
      await sql.query`SELECT * FROM Nguoi_dung_va_Gio_hang WHERE Sdt = ${sdt} OR Email = ${email}`;
    if (existingUser.recordset.length > 0) {
      return res
        .status(400)
        .json({ message: "Số điện thoại hoặc email này đã được đăng ký." });
    }

    // Thêm dữ liệu người dùng vào bảng Nguoi_dung_va_Gio_hang
    await sql.query`
            INSERT INTO Nguoi_dung_va_Gio_hang (Sdt, Email, Mat_khau, Username, verificationCode)
            VALUES (${sdt}, ${email}, ${hashedPassword}, ${username}, ${verificationCode})
        `;

    // Gửi mã xác minh qua email
    await sendVerificationEmail(email, verificationCode);
    res.status(201).json({
      message:
        "Đăng ký thành công, vui lòng kiểm tra email của bạn để nhận mã xác minh.",
    });
  } catch (error) {
    console.error(error); // Ghi log lỗi
    res.status(500).json({
      message: "Đăng ký không thành công. Vui lòng thử lại sau.",
      error: error.message,
    });
  }
});

// Route: Verify Email
app.post("/verify", async (req, res) => {
  const { email, code } = req.body;

  try {
    // Tìm người dùng dựa trên email và kiểm tra mã xác minh
    const result = await sql.query`
            SELECT * FROM Nguoi_dung_va_Gio_hang
            WHERE Email = ${email} AND verificationCode = ${code}
        `;

    const user = result.recordset[0];

    if (!user) {
      return res.status(400).json({ message: "Mã xác minh không hợp lệ." });
    }

    // Cập nhật trạng thái đã xác minh
    await sql.query`
            UPDATE Nguoi_dung_va_Gio_hang 
            SET isVerified = 1, verificationCode = NULL 
            WHERE Email = ${email}
        `;

    res.status(200).json({ message: "Xác thực thành công." });
  } catch (error) {
    res.status(500).json({ message: "Xác thực thất bại.", error });
  }
});

// Route: Login
app.post("/login", async (req, res) => {
  const { email, mat_khau } = req.body;

  try {
    const result =
      await sql.query`SELECT * FROM Nguoi_dung_va_Gio_hang WHERE Email = ${email}`;
    const user = result.recordset[0];

    if (!user) {
      return res.status(400).json({ message: "Không tìm thấy người dùng." });
    }
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Hãy xác thực tài khoản của bạn." });
    }
    const isPasswordValid = await bcrypt.compare(mat_khau, user.Mat_khau);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Sai mật khẩu." });
    }
    const token = jwt.sign({ id: user.Sdt }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
    });
    res.status(200).json({
      message: "Đăng nhập thành công.",
      token,
      username: user.Username,
      la_nguoi_ban: user.La_nguoi_ban,
    });
  } catch (error) {
    res.status(500).json({ message: "Đăng nhập thất bại.", error });
  }
});

// Route: isSeller
app.post("/isSeller", async (req, res) => {
  const { email } = req.body;

  try {
    // Lấy thông tin người dùng từ email
    const result =
      await sql.query`SELECT * FROM Nguoi_dung_va_Gio_hang WHERE Email = ${email}`;
    const user = result.recordset[0];

    if (!user) {
      return res.status(400).json({ message: "Không tìm thấy người dùng." });
    }

    // Kiểm tra xem người dùng có phải là người bán không (giả sử có trường La_nguoi_ban)
    if (user.La_nguoi_ban !== true) {
      return res
        .status(400)
        .json({ message: "Tài khoản của bạn chưa đăng ký làm người bán." });
    }

    // Nếu là người bán, trả về thành công
    res.status(200).json({ message: "Bạn là người bán." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi kiểm tra người bán." });
  }
});

//Route: Authenticate
app.get("/authenticate", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập." });
  }

  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Truy vấn cơ sở dữ liệu
    let user;
    try {
      const result =
        await sql.query`SELECT * FROM Nguoi_dung_va_Gio_hang WHERE Sdt = ${decoded.id}`;
      user = result.recordset[0];
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res
        .status(500)
        .json({ message: "Lỗi hệ thống. Không thể truy vấn cơ sở dữ liệu." });
    }

    // Kiểm tra người dùng có tồn tại và còn hoạt động không
    if (!user) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại hoặc đã bị vô hiệu hóa." });
    }

    return res.status(200).json({
      username: user.Username,
      email: user.Email,
      la_nguoi_ban: user.La_nguoi_ban,
    });
  } catch (error) {
    // Lỗi token hết hạn hoặc không hợp lệ
    console.error("Authentication error:", error.message);
    return res
      .status(401)
      .json({ message: "Phiên đăng nhập không hợp lệ.", error: error.message });
  }
});

// Route: Forgot Password
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
    const user =
      await sql.query`SELECT * FROM Nguoi_dung_va_Gio_hang WHERE Email = ${email}`;

    if (user.recordset.length === 0) {
      return res.status(404).json({ message: "Email không tồn tại." });
    }

    // Tạo mã xác minh
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Cập nhật mã xác minh trong cơ sở dữ liệu
    await sql.query`UPDATE Nguoi_dung_va_Gio_hang SET verificationCode = ${verificationCode} WHERE Email = ${email}`;

    // Gửi email chứa mã xác minh
    await sendVerificationEmail(email, verificationCode);

    res
      .status(200)
      .json({ message: "Mã xác minh đã được gửi đến email của bạn." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Quá trình quên mật khẩu gặp lỗi", error });
  }
});

// Route: Reset Password
app.post("/reset-password", async (req, res) => {
  const { verificationCode, newPassword } = req.body;

  try {
    // Tìm người dùng bằng mã xác minh
    const user =
      await sql.query`SELECT * FROM Nguoi_dung_va_Gio_hang WHERE verificationCode = ${verificationCode}`;

    if (user.recordset.length === 0) {
      return res.status(400).json({ message: "Mã xác minh không hợp lệ." });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu mới trong cơ sở dữ liệu và xóa mã xác minh
    await sql.query`UPDATE Nguoi_dung_va_Gio_hang SET Mat_khau = ${hashedPassword}, verificationCode = NULL WHERE verificationCode = ${verificationCode}`;

    res.status(200).json({ message: "Mật khẩu đã được cập nhật thành công." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Quá trình cập nhật mật khẩu gặp lỗi", error });
  }
});

// Route: Update User Information
app.put("/update-user", async (req, res) => {
  const { sdt, email, username } = req.body;

  try {
    // Cập nhật thông tin người dùng trong bảng Nguoi_dung_va_Gio_hang
    await sql.query`
            UPDATE Nguoi_dung_va_Gio_hang 
            SET Email = ${email}, Username = ${username}
            WHERE Sdt = ${sdt}
        `;

    res
      .status(200)
      .json({ message: "Thông tin người dùng đã được cập nhật thành công." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Cập nhật thông tin người dùng thất bại", error });
  }
});

// Route: Logout

app.post("/logout", (req, res) => {
  // console.log(req.user);
  const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header
  if (token) {
    jwtBlacklist.add(token); // Thêm token vào danh sách đen
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.status(200).json({ message: "Đăng xuất thành công." });
});

// Route: Search Products
app.get("/search-products", verifyToken, async (req, res) => {
  const { keyword, filters } = req.query;

  try {
    // Kiểm tra nếu không có từ khóa tìm kiếm, yêu cầu phải có keyword
    if (!keyword) {
      return res
        .status(400)
        .json({ message: "Bạn phải cung cấp từ khóa tìm kiếm." });
    }

    // Câu truy vấn cơ sở dữ liệu để tìm kiếm sản phẩm
    let query = `SELECT * FROM San_pham WHERE Ten_san_pham LIKE '%${keyword}%'`;

    // Thêm điều kiện lọc nếu có
    if (filters) {
      const { brand, priceRange, seller } = JSON.parse(filters);
      if (brand) query += ` AND Thuong_hieu = '${brand}'`;
      if (priceRange)
        query += ` AND Gia BETWEEN ${priceRange.min} AND ${priceRange.max}`;
      if (seller) query += ` AND Nguoi_ban = '${seller}'`;
    }

    // Truy vấn cơ sở dữ liệu
    const products = await sql.query(query);

    // Không có sản phẩm phù hợp
    if (products.recordset.length === 0) {
      return res.status(404).json({
        message: "Không có sản phẩm nào phù hợp với yêu cầu tìm kiếm của bạn.",
      });
    }

    // Hiển thị kết quả
    res.status(200).json(products.recordset);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi hệ thống khi tìm kiếm sản phẩm.", error });
  }
});

// Route: View Product Information
app.get("/product/:id", verifyToken, async (req, res) => {
  const productId = req.params.id;

  try {
    // Truy vấn cơ sở dữ liệu để lấy thông tin sản phẩm theo ID
    const result = await sql.query`
            SELECT * FROM San_pham WHERE Id_san_pham = ${productId}
        `;

    const product = result.recordset[0];

    // Kiểm tra xem sản phẩm có tồn tại không
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tìm thấy." });
    }

    // Trả về thông tin sản phẩm
    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin sản phẩm.", error });
  }
});

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

// Route: Sign Up as Seller
app.post("/sign-up-seller", verifyToken, async (req, res) => {
  const {
    ten,
    mo_ta,
    url_logo,
    so_nha,
    phuong_or_xa,
    quan_or_huyen,
    tinh_or_tp,
  } = req.body;

  const Sdt = req.user.id;
  try {
    if (ten === undefined || ten === "") {
      return res.status(400).json({ message: "Tên không được để trống." });
    }
    const existingSeller =
      await sql.query`SELECT * FROM Nguoi_ban_va_Cua_hang WHERE Sdt = ${Sdt}`;
    if (existingSeller.recordset.length > 0) {
      return res
        .status(400)
        .json({ message: "Bạn đã đăng ký trở thành người bán rồi." });
    }

    const result = await sql.query`
            INSERT INTO Dia_chi (ID, So_nha, Phuong_or_Xa, Quan_or_Huyen, Tinh_or_TP)
            OUTPUT INSERTED.ID
            VALUES (${snowflake.generate()}, ${so_nha}, ${phuong_or_xa}, ${quan_or_huyen}, ${tinh_or_tp});
        `;

    console.log(result);
    const diaChi = result.recordset[0].ID;

    await sql.query`
            INSERT INTO Nguoi_ban_va_Cua_hang (Ma_cua_hang, Ten, Mo_ta, Url_logo, Sdt, Dia_chi)
            VALUES (${snowflake.generate()}, ${ten}, ${mo_ta}, ${url_logo}, ${Sdt}, ${diaChi});
        `;

    await sql.query`
        UPDATE Nguoi_dung_va_Gio_hang
        SET La_nguoi_ban = 1
        WHERE Sdt = ${Sdt};
        `;

    res.status(201).json({
      message: "Đăng ký trở thành người bán thành công.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Đăng ký trở thành người bán không thành công. Vui lòng thử lại sau.",
      error: error.message,
    });
  }
});

// Route: Add Product Category
// app.post("/add-product-category", verifyToken, async (req, res) => {
//   const { ten_danh_muc } = req.body;
//   const Sdt = req.user.id;

//   try {
//     if (ten_danh_muc === undefined || ten_danh_muc === "") {
//       return res
//         .status(400)
//         .json({ message: "Tên danh mục không được để trống." });
//     }

//     const existingSeller =
//       await sql.query`SELECT * FROM Nguoi_ban_va_Cua_hang WHERE Sdt = ${Sdt}`;
//     if (existingSeller.recordset.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "Bạn cần đăng ký trở thành người bán trước." });
//     }

//     await sql.query`
//             INSERT INTO Danh_muc_hang (Ma_cua_hang, Ten_danh_muc)
//             VALUES (${existingSeller.recordset[0].Ma_cua_hang}, ${ten_danh_muc});
//         `;
//     res.status(201).json({
//       message: "Thêm danh mục hàng thành công.",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Thêm danh mục hàng không thành công. Vui lòng thử lại sau.",
//       error: error.message,
//     });
//   }
// });
app.get("/get-categories", verifyToken, async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Danh_muc_hang`; // Lấy danh mục
        const categories = result.recordset.map((item) => item.Ten_danh_muc); // Lấy danh sách tên danh mục

        res.status(200).json(categories); // Trả về danh sách danh mục
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).send("Lỗi hệ thống. Vui lòng thử lại.");
    }
});

app.post("/add-category", verifyToken, async (req, res) => {
const { ten_danh_muc } = req.body;

if (!ten_danh_muc || typeof ten_danh_muc !== "string") {
    return res.status(400).json({ message: "Tên danh mục không hợp lệ." });
}

try {
    const pool = await sql.connect(); // Kết nối database

    // Kiểm tra xem danh mục đã tồn tại chưa
    // const checkCategory = await pool
    // .request()
    // .input("ten_danh_muc", sql.NVarChar, ten_danh_muc)
    // .query`
    //     SELECT Ten_danh_muc 
    //     FROM Danh_muc_hang 
    //     WHERE Ten_danh_muc COLLATE Latin1_General_CI_AS = @ten_danh_muc
    // `;
    // if (checkCategory.recordset.length > 0) {
    // return res.status(400).json({ message: "Danh mục đã tồn tại." });
    // }

    // Thêm danh mục mới
    await pool
    .request()
    .input("ten_danh_muc", sql.NVarChar, ten_danh_muc)
    .query`INSERT INTO Danh_muc_hang (Ten_danh_muc) VALUES (@ten_danh_muc)`;

    res.status(201).json({ message: "Danh mục mới đã được thêm thành công." });
} catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Có lỗi khi thêm danh mục.", error: error.message });
}
});



// Viết API lấy thông tin người bán bao gồm cẩ thông tin cửa hàng và danh mục hàng
// Thêm thông tin địa chỉ cửa hàng nữa
// Route: Get Seller Information

app.get("/seller-info", verifyToken, async (req, res) => {
  const Sdt = req.user.id;

  try {
    const result = await sql.query`SELECT *
FROM (SELECT * FROM Nguoi_ban_va_Cua_hang WHERE Sdt = ${Sdt}) AS T JOIN Dia_chi ON Dia_chi = ID`;
    const seller = result.recordset[0];

    if (!seller) {
      return res.status(404).json({ message: "Người bán không tồn tại." });
    }

    const danhMucResult = await sql.query`SELECT Ten_danh_muc
FROM Danh_muc_hang
WHERE Ma_cua_hang = ${seller.Ma_cua_hang}`;
    // const danhMuc = danhMucResult.recordset;
    const danhMuc = danhMucResult.recordset.map((item) => item.Ten_danh_muc);
    seller.danh_muc_hang = danhMuc;

    res.status(200).json(seller);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi lấy thông tin người bán.",
      error: error.message,
    });
  }
});

// Route: Add Product
app.post("/add-product", verifyToken, async (req, res) => {
  const {
    ten_san_pham,
    xuat_xu,
    thuong_hieu,
    mo_ta,
    gia,
    url_thumbnail,
    ten_danh_muc,
    mau_ma_san_phams,
    hinh_anh_san_phams,
  } = req.body;
  const Sdt = req.user.id;

  try {
    if (
      mau_ma_san_phams === undefined ||
      hinh_anh_san_phams === undefined ||
      mau_ma_san_phams.length === 0 ||
      hinh_anh_san_phams.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Sản phẩm cần ít nhất một mẫu và một hình ảnh." });
    }
    const existingSeller =
      await sql.query`SELECT * FROM Nguoi_ban_va_Cua_hang WHERE Sdt = ${Sdt}`;
    if (existingSeller.recordset.length === 0) {
      return res
        .status(400)
        .json({ message: "Bạn cần đăng ký trở thành người bán trước." });
    }

    const Ma_cua_hang = existingSeller.recordset[0].Ma_cua_hang;

    const result = await sql.query`
            INSERT INTO San_pham (Ma_san_pham, Ten_san_pham, Xuat_xu, Thuong_hieu, Mo_ta, Gia, Url_thumbnail, SL_da_ban, Ma_cua_hang, Ten_danh_muc)
            OUTPUT INSERTED.Ma_san_pham
            VALUES (${snowflake.generate()}, ${ten_san_pham}, ${xuat_xu}, ${thuong_hieu}, ${mo_ta}, ${gia}, ${url_thumbnail}, 0, ${Ma_cua_hang}, ${ten_danh_muc});
        `;

    const Ma_san_pham = result.recordset[0].Ma_san_pham;

    for (let i = 0; i < mau_ma_san_phams.length; i++) {
      const { mau_sac, kich_co, so_luong_ton_kho } = mau_ma_san_phams[i];
      await sql.query`
                INSERT INTO Mau_ma_san_pham (ID, Ma_san_pham, Mau_sac, Kich_co, So_luong_ton_kho)
                VALUES (${snowflake.generate()}, ${Ma_san_pham}, ${mau_sac}, ${kich_co}, ${so_luong_ton_kho});
            `;
    }

    for (let i = 0; i < hinh_anh_san_phams.length; i++) {
      const url_hinh_anh = hinh_anh_san_phams[i];
      await sql.query`
                INSERT INTO Hinh_anh_san_pham (Ma_san_pham, Url_hinh_anh)
                VALUES (${Ma_san_pham}, ${url_hinh_anh});
            `;
    }

    res.status(201).json({
      message: "Thêm sản phẩm thành công.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Thêm sản phẩm không thành công. Vui lòng thử lại sau.",
      error: error.message,
    });
  }
});

// Route: GET /product-seller
app.get("/product-seller", verifyToken, async (req, res) => {
    const Sdt = req.user.id; // Sdt của người bán từ token
  
    try {
      const result = await sql.query`
        SELECT 
            sp.Ma_san_pham,
            sp.Ten_san_pham,
            sp.Gia,
            sp.SL_da_ban,
            sp.Ten_danh_muc,
            ISNULL(SUM(msp.So_luong_ton_kho), 0) AS Ton_kho
        FROM San_pham sp
        LEFT JOIN Mau_ma_san_pham msp ON sp.Ma_san_pham = msp.Ma_san_pham
        WHERE sp.Ma_cua_hang = (
          SELECT Ma_cua_hang 
          FROM Nguoi_ban_va_Cua_hang 
          WHERE Sdt = ${Sdt}
        )
        GROUP BY sp.Ma_san_pham, sp.Ten_san_pham, sp.Gia, sp.SL_da_ban, sp.Ten_danh_muc
      `;
  
      const products = result.recordset;
  
      if (products.length === 0) {
        return res.status(404).json({ message: "Không có sản phẩm nào." });
      }
  
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Lỗi khi lấy danh sách sản phẩm.",
        error: error.message,
      });
    }
  });

// Route: Get Detail Product
app.get("/product-detail/:id", verifyToken, async (req, res) => {
  const Ma_san_pham = req.params.id;

  try {
    const result = await sql.query`
            SELECT * FROM San_pham WHERE Ma_san_pham = ${Ma_san_pham}
        `;

    const product = result.recordset[0];

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tìm thấy." });
    }

    const mauMaResult = await sql.query`
            SELECT * FROM Mau_ma_san_pham WHERE Ma_san_pham = ${Ma_san_pham}
        `;
    const mauMa = mauMaResult.recordset;

    const hinhAnhResult = await sql.query`
            SELECT * FROM Hinh_anh_san_pham WHERE Ma_san_pham = ${Ma_san_pham}
        `;
    const hinhAnh = hinhAnhResult.recordset;

    product.mau_ma_san_phams = mauMa.map((item) => ({
      mau_sac: item.Mau_sac,
      kich_co: item.Kich_co,
      so_luong_ton_kho: item.So_luong_ton_kho,
    }));
    product.hinh_anh_san_phams = hinhAnh.map((item) => item.Url_hinh_anh);

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi lấy thông tin sản phẩm.",
      error: error.message,
    });
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

// Route: Get Best Selling Products
app.get("/best-selling-products", async (req, res) => {
  try {
    const result = await sql.query`
            SELECT TOP 50 * FROM San_pham ORDER BY SL_da_ban DESC
        `;

    const products = result.recordset;

    if (products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách sản phẩm.",
      error: error.message,
    });
  }
});

// Route: Search Products
app.get("/search-products", async (req, res) => {
  const { keyword } = req.query;

  try {
    if (!keyword) {
      return res.status(400).json({ message: "Vui lòng nhập từ khóa." });
    }

    const result = await sql.query`
            SELECT * FROM San_pham WHERE Ten_san_pham LIKE '%${keyword}%'
        `;

    const products = result.recordset;

    if (products.length === 0) {
      return res.status(404).json({
        message: "Không có sản phẩm nào phù hợp với từ khóa tìm kiếm.",
      });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi tìm kiếm sản phẩm.",
      error: error.message,
    });
  }
});

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
