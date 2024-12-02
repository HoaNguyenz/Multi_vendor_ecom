const express = require("express");
const bcrypt = require("bcryptjs");
const { sql } = require("../db");
const jwt = require("jsonwebtoken");
const {
  verifyToken,
  jwtBlacklist,
  snowflake,
} = require("../middleware/verifyToken");
const router = express.Router();
require("dotenv").config();

// Route: Get user information
router.get("/get-user-info/:username", async (req, res) => {
    const { username } = req.params;
  
    try {
      const result = await sql.query`
        SELECT 
          nd.Sdt,
          nd.Email,
          nd.Username,
          nd.Ho_va_ten,
          nd.Gioi_tinh,
          nd.Ngay_sinh,
          nd.La_nguoi_ban,
          nd.Url_avatar,
          dc.So_nha,
          dc.Phuong_or_Xa,
          dc.Quan_or_Huyen,
          dc.Tinh_or_TP
        FROM Nguoi_dung_va_Gio_hang AS nd
        LEFT JOIN Dia_chi AS dc ON nd.Sdt = dc.Sdt
        WHERE nd.Username = ${username}
      `;
  
      if (result.recordset.length > 0) {
        res.status(200).json(result.recordset); // Trả về thông tin người dùng và địa chỉ
      } else {
        res.status(404).json({ message: "Người dùng không tồn tại." });
      }
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng", error });
    }
  });
  
// Route: Update User Information
router.put("/update-user", async (req, res) => {
  const { sdt, ho_va_ten, gioi_tinh, ngay_sinh } = req.body;

  try {
    // Update user information in the Nguoi_dung_va_Gio_hang table
    await sql.query`
      UPDATE Nguoi_dung_va_Gio_hang 
      SET 
        Ho_va_ten = ${ho_va_ten}, 
        Gioi_tinh = ${gioi_tinh}, 
        Ngay_sinh = ${ngay_sinh}
      WHERE Sdt = ${sdt}
    `;

    res.status(200).json({ message: "Thông tin người dùng đã được cập nhật thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cập nhật thông tin người dùng thất bại", error });
  }
});

module.exports = router;
