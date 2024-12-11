const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const { jwtBlacklist } = require("../middleware");
const { sql } = require("../db");

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Hàm gửi email
const sendVerificationEmail = async (email, verificationCode) => {
  transporter.sendMail({
    to: email,
    subject: "Verify your account",
    html: `Your verification code is: <strong>${verificationCode}</strong>`,
  });
};

const signUp = async (req, res) => {
  const { username, email, sdt, mat_khau, xac_nhan_mat_khau } = req.body;

  if (mat_khau !== xac_nhan_mat_khau) {
    return res
      .status(400)
      .json({ message: "Mật khẩu và xác nhận mật khẩu không khớp." });
  }

  const hashedPassword = await bcrypt.hash(mat_khau, 10);
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  try {
    const existingUser =
      await sql.query`SELECT * FROM Nguoi_dung_va_Gio_hang WHERE Sdt = ${sdt} OR Email = ${email}`;
    if (existingUser.recordset.length > 0) {
      return res
        .status(400)
        .json({ message: "Số điện thoại hoặc email này đã được đăng ký." });
    }

    await sql.query`
        INSERT INTO Nguoi_dung_va_Gio_hang (Sdt, Email, Mat_khau, Username, verificationCode)
        VALUES (${sdt}, ${email}, ${hashedPassword}, ${username}, ${verificationCode})
    `;

    sendVerificationEmail(email, verificationCode);
    res.status(201).json({
      message:
        "Đăng ký thành công, vui lòng kiểm tra email để nhận mã xác minh.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Đăng ký không thành công. Vui lòng thử lại sau.",
      error: error.message,
    });
  }
};

const verify = async (req, res) => {
  const { email, code } = req.body;

  try {
    const result = await sql.query`
        SELECT * FROM Nguoi_dung_va_Gio_hang
        WHERE Email = ${email} AND verificationCode = ${code}
    `;

    const user = result.recordset[0];

    if (!user) {
      return res.status(400).json({ message: "Mã xác minh không hợp lệ." });
    }

    await sql.query`
        UPDATE Nguoi_dung_va_Gio_hang 
        SET isVerified = 1, verificationCode = NULL 
        WHERE Email = ${email}
    `;

    res.status(200).json({ message: "Xác thực thành công." });
  } catch (error) {
    res.status(500).json({ message: "Xác thực thất bại.", error });
  }
};

const login = async (req, res) => {
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
      sdt: user.Sdt,
      email: user.Email,
      url_avatar: user.Url_avatar,
    });
  } catch (error) {
    res.status(500).json({ message: "Đăng nhập thất bại.", error });
  }
};

const isSeller = async (req, res) => {
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
};

const authenticate = async (req, res) => {
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
      sdt: user.Sdt,
      url_avatar: user.Url_avatar,
    });
  } catch (error) {
    // Lỗi token hết hạn hoặc không hợp lệ
    console.error("Authentication error:", error.message);
    return res
      .status(401)
      .json({ message: "Phiên đăng nhập không hợp lệ.", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
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
    sendVerificationEmail(email, verificationCode);

    res
      .status(200)
      .json({ message: "Mã xác minh đã được gửi đến email của bạn." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Quá trình quên mật khẩu gặp lỗi", error });
  }
};

const resetPassword = async (req, res) => {
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
};

const logout = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header
  if (token) {
    jwtBlacklist.add(token); // Thêm token vào danh sách đen
  }

  res.clearCookie("token", {
    // httpOnly: true,
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
};

module.exports = {
  signUp,
  verify,
  login,
  isSeller,
  authenticate,
  forgotPassword,
  resetPassword,
  logout,
};
