// server.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { connectDB, sql } = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

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
app.post('/signup', async (req, res) => {
    const { sdt, email, mat_khau, ho_va_ten_dem, ten, gioi_tinh, ngay_sinh, la_nguoi_ban, dia_chi } = req.body;

    const hashedPassword = await bcrypt.hash(mat_khau, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // Tạo mã xác minh 6 chữ số

    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await sql.query`SELECT * FROM Nguoi_dung_va_Gio_hang WHERE Sdt = ${sdt} OR Email = ${email}`;
        if (existingUser.recordset.length > 0) {
            return res.status(400).json({ message: 'Số điện thoại hoặc email này đã được đăng ký.' });
        }
        
        // Insert user data
        await sql.query`
            INSERT INTO Nguoi_dung_va_Gio_hang (Sdt, Email, Mat_khau, Ho_va_ten_dem, Ten, Gioi_tinh, Ngay_sinh, La_nguoi_ban, verificationCode)
            VALUES (${sdt}, ${email}, ${hashedPassword}, ${ho_va_ten_dem}, ${ten}, ${gioi_tinh}, ${ngay_sinh}, ${la_nguoi_ban}, ${verificationCode})
        `;

        if (dia_chi) {
            await sql.query`
                INSERT INTO Dia_chi_nguoi_dung (Sdt, So_nha, Phuong_or_Xa, Quan_or_Huyen, Tinh_or_TP)
                VALUES (${sdt}, ${dia_chi.so_nha}, ${dia_chi.phuong_or_xa}, ${dia_chi.quan_or_huyen}, ${dia_chi.tinh_or_tp})
            `;
        }

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


// Route: Sign In
app.post('/signin', async (req, res) => {
    const { email, mat_khau } = req.body;

    try {
        const result = await sql.query`SELECT * FROM Nguoi_dung_va_Gio_hang WHERE Email = ${email}`;
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
        const user = await sql.query`SELECT * FROM Nguoi_dung_va_Gio_hang WHERE Email = ${email}`;
        
        if (user.recordset.length === 0) {
            return res.status(404).json({ message: 'Email không tồn tại.' });
        }

        // Tạo mã xác minh
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        
        // Cập nhật mã xác minh trong cơ sở dữ liệu
        await sql.query`UPDATE Nguoi_dung_va_Gio_hang SET verificationCode = ${verificationCode} WHERE Email = ${email}`;
        
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
        const user = await sql.query`SELECT * FROM Nguoi_dung_va_Gio_hang WHERE verificationCode = ${verificationCode}`;
        
        if (user.recordset.length === 0) {
            return res.status(400).json({ message: 'Mã xác minh không hợp lệ.' });
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới trong cơ sở dữ liệu và xóa mã xác minh
        await sql.query`UPDATE Nguoi_dung_va_Gio_hang SET Mat_khau = ${hashedPassword}, verificationCode = NULL WHERE verificationCode = ${verificationCode}`;
        
        res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Quá trình cập nhật mật khẩu gặp lỗi', error });
    }
});

// Route: Update User Information
app.put('/update-user', async (req, res) => {
    const { sdt, email, ho_va_ten_dem, ten, gioi_tinh, ngay_sinh, dia_chi } = req.body;

    try {
        // Cập nhật thông tin người dùng trong bảng Nguoi_dung_va_Gio_hang
        await sql.query`
            UPDATE Nguoi_dung_va_Gio_hang 
            SET Email = ${email}, Ho_va_ten_dem = ${ho_va_ten_dem}, Ten = ${ten}, 
                Gioi_tinh = ${gioi_tinh}, Ngay_sinh = ${ngay_sinh}
            WHERE Sdt = ${sdt}
        `;

        // Cập nhật địa chỉ người dùng nếu có
        if (dia_chi) {
            await sql.query`
                UPDATE Dia_chi_nguoi_dung 
                SET So_nha = ${dia_chi.so_nha}, Phuong_or_Xa = ${dia_chi.phuong_or_xa}, 
                    Quan_or_Huyen = ${dia_chi.quan_or_huyen}, Tinh_or_TP = ${dia_chi.tinh_or_tp}
                WHERE Sdt = ${sdt}
            `;
        }

        res.status(200).json({ message: 'Thông tin người dùng đã được cập nhật thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Cập nhật thông tin người dùng thất bại', error });
    }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
