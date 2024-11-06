// server.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { connectDB, sql } = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
connectDB();

// Setup Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Utility functions
const sendVerificationEmail = async (email, verificationCode) => {
    await transporter.sendMail({
        to: email,
        subject: 'Verify your account',
        html: `Your verification code is: <strong>${verificationCode}</strong>`
    });
};

// Route: Sign Up
app.post('/sign-up', async (req, res) => {
    const { username, email, sdt, mat_khau, xac_nhan_mat_khau} = req.body;

    // Kiểm tra mật khẩu có khớp hay không
    if (mat_khau !== xac_nhan_mat_khau) {
        return res.status(400).json({ message: 'Mật khẩu và xác nhận mật khẩu không khớp.' });
    }

    const hashedPassword = await bcrypt.hash(mat_khau, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // Tạo mã xác minh 6 chữ số

    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await sql.query`SELECT * FROM Nguoi_dung WHERE Sdt = ${sdt} OR Email = ${email}`;
        if (existingUser.recordset.length > 0) {
            return res.status(400).json({ message: 'Số điện thoại hoặc email này đã được đăng ký.' });
        }
        
        // Thêm dữ liệu người dùng vào bảng Nguoi_dung
        await sql.query`
            INSERT INTO Nguoi_dung (Sdt, Email, Mat_khau, Username, verificationCode)
            VALUES (${sdt}, ${email}, ${hashedPassword}, ${username}, ${verificationCode})
        `;

        // Gửi mã xác minh qua email
        await sendVerificationEmail(email, verificationCode);
        res.status(201).json({ message: 'Đăng ký thành công, vui lòng kiểm tra email của bạn để nhận mã xác minh.' });
    } catch (error) {
        console.error(error); // Ghi log lỗi
        res.status(500).json({ message: 'Đăng ký không thành công. Vui lòng thử lại sau.', error: error.message });
    }
});


// Route: Verify Email
app.post('/verify', async (req, res) => {
    const { email, code } = req.body;

    try {
        // Tìm người dùng dựa trên email và kiểm tra mã xác minh
        const result = await sql.query`
            SELECT * FROM Nguoi_dung
            WHERE Email = ${email} AND verificationCode = ${code}
        `;

        const user = result.recordset[0];

        if (!user) {
            return res.status(400).json({ message: "Mã xác minh không hợp lệ." });
        }

        // Cập nhật trạng thái đã xác minh
        await sql.query`
            UPDATE Nguoi_dung 
            SET isVerified = 1, verificationCode = NULL 
            WHERE Email = ${email}
        `;

        res.status(200).json({ message: "Xác thực thành công." });
    } catch (error) {
        res.status(500).json({ message: "Xác thực thất bại.", error });
    }
});


// Route: Login
app.post('/login', async (req, res) => {
    const { email, mat_khau } = req.body;

    try {
        const result = await sql.query`SELECT * FROM Nguoi_dung WHERE Email = ${email}`;
        const user = result.recordset[0];

        if (!user) {
            return res.status(400).json({ message: 'Không tìm thấy người dùng.' });
        }
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Hãy xác thực tài khoản của bạn.' });
        }
        const isPasswordValid = await bcrypt.compare(mat_khau, user.Mat_khau);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Sai mật khẩu.' });
        }
        const token = jwt.sign({ id: user.Sdt }, process.env.JWT_SECRET);
        res.json({ message: 'Đăng nhập thành công.', token });
    } catch (error) {
        res.status(500).json({ message: 'Đăng nhập thất bại.', error });
    }
});

// Route: Forgot Password
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
        const user = await sql.query`SELECT * FROM Nguoi_dung WHERE Email = ${email}`;
        
        if (user.recordset.length === 0) {
            return res.status(404).json({ message: 'Email không tồn tại.' });
        }

        // Tạo mã xác minh
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        
        // Cập nhật mã xác minh trong cơ sở dữ liệu
        await sql.query`UPDATE Nguoi_dung SET verificationCode = ${verificationCode} WHERE Email = ${email}`;
        
        // Gửi email chứa mã xác minh
        await sendVerificationEmail(email, verificationCode);
        
        res.status(200).json({ message: 'Mã xác minh đã được gửi đến email của bạn.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Quá trình quên mật khẩu gặp lỗi', error });
    }
});

// Route: Reset Password
app.post('/reset-password', async (req, res) => {
    const { verificationCode, newPassword } = req.body;

    try {
        // Tìm người dùng bằng mã xác minh
        const user = await sql.query`SELECT * FROM Nguoi_dung WHERE verificationCode = ${verificationCode}`;
        
        if (user.recordset.length === 0) {
            return res.status(400).json({ message: 'Mã xác minh không hợp lệ.' });
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới trong cơ sở dữ liệu và xóa mã xác minh
        await sql.query`UPDATE Nguoi_dung SET Mat_khau = ${hashedPassword}, verificationCode = NULL WHERE verificationCode = ${verificationCode}`;
        
        res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Quá trình cập nhật mật khẩu gặp lỗi', error });
    }
});

// Route: Update User Information
app.put('/update-user', async (req, res) => {
    const { sdt, email, username} = req.body;

    try {
        // Cập nhật thông tin người dùng trong bảng Nguoi_dung
        await sql.query`
            UPDATE Nguoi_dung 
            SET Email = ${email}, Username = ${username}
            WHERE Sdt = ${sdt}
        `;

        res.status(200).json({ message: 'Thông tin người dùng đã được cập nhật thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Cập nhật thông tin người dùng thất bại', error });
    }
});

// Route: Logout
app.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Đăng xuất thành công.' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
