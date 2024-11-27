// server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { connectDB, sql } = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', // Địa chỉ frontend
    credentials: true,              // Cho phép gửi cookie và thông tin xác thực
}));
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

// Blacklist to store invalidated JWTs
const jwtBlacklist = new Set();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    if (!token || jwtBlacklist.has(token)) {
        return res.status(401).json({ message: 'Bạn cần đăng nhập để thực hiện chức năng này.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
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
        const token = jwt.sign({ id: user.Sdt }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, {
            httpOnly: true,
            // secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // Cookie expires in 1 day
        });
        res.status(200).json({ message: 'Đăng nhập thành công.', token, username: user.Username });
    } catch (error) {
        res.status(500).json({ message: 'Đăng nhập thất bại.', error });
    }
});

// Route: Authenticate
// app.get('/authenticate', async (req, res) => {
//     const token = req.cookies.token;

//     if (!token) {
//         return res.status(401).json({ message: 'Bạn chưa đăng nhập.' });
//     }

//     try {
//         // Xác thực token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Truy vấn người dùng dựa trên thông tin từ token
//         const result = await sql.query`SELECT * FROM Nguoi_dung WHERE Sdt = ${decoded.id}`;
//         const user = result.recordset[0];

//         // Kiểm tra người dùng có tồn tại và còn hoạt động không
//         if (!user || !user.isActive) {
//             return res.status(404).json({ message: 'Người dùng không tồn tại hoặc đã bị vô hiệu hóa.' });
//         }

//         // Trả về thông tin người dùng cần thiết
//         res.status(200).json({
//             username: user.Username,
//             email: user.Email,
//         });
//     } catch (error) {
//         // Lỗi token hết hạn hoặc không hợp lệ
//         return res.status(401).json({ message: 'Phiên đăng nhập không hợp lệ.', error: error.message });
//     }
// });
app.get('/authenticate', async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Bạn chưa đăng nhập.' });
    }

    try {
        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Truy vấn cơ sở dữ liệu
        let user;
        try {
            const result = await sql.query`SELECT * FROM Nguoi_dung WHERE Sdt = ${decoded.id}`;
            user = result.recordset[0];
        } catch (dbError) {
            console.error("Database error:", dbError);
            return res.status(500).json({ message: 'Lỗi hệ thống. Không thể truy vấn cơ sở dữ liệu.' });
        }

        // Kiểm tra người dùng có tồn tại và còn hoạt động không
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại hoặc đã bị vô hiệu hóa.' });
        }

        // Trả về thông tin người dùng cần thiết
        return res.status(200).json({
            username: user.Username,
            email: user.Email,
        });
    } catch (error) {
        // Lỗi token hết hạn hoặc không hợp lệ
        console.error("Authentication error:", error.message);
        return res.status(401).json({ message: 'Phiên đăng nhập không hợp lệ.', error: error.message });
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
    const token = req.headers.authorization?.split(' ')[1]; // Lấy token từ header
    if (token) {
        jwtBlacklist.add(token); // Thêm token vào danh sách đen
    }

    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.status(200).json({ message: 'Đăng xuất thành công.' });
});

// Route: Search Products
app.get('/search-products', verifyToken, async (req, res) => {
    const { keyword, filters } = req.query;

    try {
        // Kiểm tra nếu không có từ khóa tìm kiếm, yêu cầu phải có keyword
        if (!keyword) {
            return res.status(400).json({ message: 'Bạn phải cung cấp từ khóa tìm kiếm.' });
        }

        // Câu truy vấn cơ sở dữ liệu để tìm kiếm sản phẩm
        let query = `SELECT * FROM San_pham WHERE Ten_san_pham LIKE '%${keyword}%'`;

        // Thêm điều kiện lọc nếu có
        if (filters) {
            const { brand, priceRange, seller } = JSON.parse(filters);
            if (brand) query += ` AND Thuong_hieu = '${brand}'`;
            if (priceRange) query += ` AND Gia BETWEEN ${priceRange.min} AND ${priceRange.max}`;
            if (seller) query += ` AND Nguoi_ban = '${seller}'`;
        }

        // Truy vấn cơ sở dữ liệu
        const products = await sql.query(query);

        // Không có sản phẩm phù hợp
        if (products.recordset.length === 0) {
            return res.status(404).json({ message: 'Không có sản phẩm nào phù hợp với yêu cầu tìm kiếm của bạn.' });
        }

        // Hiển thị kết quả
        res.status(200).json({ products: products.recordset });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi hệ thống khi tìm kiếm sản phẩm.', error });
    }
});

// Route: View Product Information
app.get('/product/:id', verifyToken, async (req, res) => {
    const productId = req.params.id;

    try {
        // Truy vấn cơ sở dữ liệu để lấy thông tin sản phẩm theo ID
        const result = await sql.query`
            SELECT * FROM San_pham WHERE Id_san_pham = ${productId}
        `;

        const product = result.recordset[0];

        // Kiểm tra xem sản phẩm có tồn tại không
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tìm thấy.' });
        }

        // Trả về thông tin sản phẩm
        res.status(200).json({ product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi lấy thông tin sản phẩm.', error });
    }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
