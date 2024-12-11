const { sql } = require("../db");
require("dotenv").config();

const { snowflake } = require("../utils");

const signUpSeller = async (req, res) => {
  const {
    ten,
    mo_ta,
    url_logo,
    so_nha,
    phuong_or_xa,
    quan_or_huyen,
    tinh_or_tp,
    sdt,
  } = req.body;

  const Sdt = sdt;
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
};

const getSellerInfo = async (req, res) => {
  const Sdt = req.user.id;

  try {
    const result = await sql.query`SELECT *
    FROM (SELECT * FROM Nguoi_ban_va_Cua_hang WHERE Sdt = ${Sdt}) AS T JOIN Dia_chi ON Dia_chi = ID`;
    const seller = result.recordset[0];
    console.log(seller);

    if (!seller) {
      return res.status(404).json({ message: "Người bán không tồn tại." });
    }
    res.status(200).json(seller);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi lấy thông tin người bán.",
      error: error.message,
    });
  }
};

const updateShop = async (req, res) => {
  const Sdt = req.user.id;
  const { Ten, Mo_ta, Url_logo } = req.body;

  try {
    // Kiểm tra xem shop có tồn tại không
    const shopResult =
      await sql.query`SELECT Ma_cua_hang FROM Nguoi_ban_va_Cua_hang WHERE Sdt = ${Sdt}`;
    const shop = shopResult.recordset[0];

    if (!shop) {
      return res.status(404).json({ message: "Cửa hàng không tồn tại." });
    }

    // Cập nhật thông tin cửa hàng
    await sql.query`UPDATE Nguoi_ban_va_Cua_hang 
                      SET Ten = ${Ten}, Url_logo = ${Url_logo}, Mo_ta = ${Mo_ta}
                      WHERE Sdt = ${Sdt}`;

    res
      .status(200)
      .json({ message: "Cập nhật thông tin cửa hàng thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi cập nhật thông tin cửa hàng.",
      error: error.message,
    });
  }
};

module.exports = {
  signUpSeller,
  getSellerInfo,
  updateShop,
};
