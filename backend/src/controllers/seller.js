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

const getOrders = async (req, res) => {
  const Sdt = req.user.id; // Số điện thoại của người bán (lấy từ user đã đăng nhập)
  const status = req.query.status;

  try {
    let str = `
      SELECT 
        dh.*,
        nd.Ho_va_ten AS Ten_nguoi_dung
      FROM Don_hang dh
      JOIN Nguoi_dung_va_Gio_hang nd ON dh.Sdt = nd.Sdt
      WHERE dh.Ma_cua_hang = (
        SELECT Ma_cua_hang FROM Nguoi_ban_va_Cua_hang WHERE Sdt = '${Sdt}'
      )
    `;

    // Thêm điều kiện lọc theo trạng thái đơn hàng nếu có
    if (status) str += ` AND dh.Trang_thai = N'${status}'`;

    const result = await sql.query(str);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đơn hàng:", error);
    res.status(500).json({
      message: "Lỗi khi lấy thông tin đơn hàng.",
      error: error.message,
    });
  }
};

const confirmOrder = async (req, res) => {
  // const { Ma_don_hang } = req.body;
  const Ma_don_hang = req.params.id;

  try {
    await sql.query(`
    UPDATE Don_hang
    SET Trang_thai = N'Đang giao hàng'
    WHERE Ma_don_hang = ${Ma_don_hang}`);

    // Trừ số lượng sản phẩm trong kho
    const result = await sql.query(`
    SELECT Mau_ma_sp, So_luong
    FROM Chi_tiet_don_hang
    WHERE Ma_don_hang = ${Ma_don_hang}`);

    for (let i = 0; i < result.recordset.length; i++) {
      const { Mau_ma_sp, So_luong } = result.recordset[i];
      await sql.query(`
      UPDATE Mau_ma_san_pham
      SET So_luong_ton_kho = So_luong_ton_kho - ${So_luong}
      WHERE ID = ${Mau_ma_sp}`);
    }

    res.status(200).json({ message: "Xác nhận đơn hàng thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi xác nhận đơn hàng.",
      error: error.message,
    });
  }
};

const confirmDelivery = async (req, res) => {
  const Ma_don_hang = req.params.id;

  try {
    await sql.query(`
    UPDATE Don_hang
    SET Trang_thai = N'Đã giao thành công', Thoi_gian_giao_thuc_te = GETDATE()
    WHERE Ma_don_hang = ${Ma_don_hang}`);

    // Cộng số lượng sản phẩm đã bán SL_da_ban
    const result = await sql.query(`
    SELECT Mau_ma_sp, So_luong
    FROM Chi_tiet_don_hang
    WHERE Ma_don_hang = ${Ma_don_hang}`);

    for (let i = 0; i < result.recordset.length; i++) {
      const { Mau_ma_sp, So_luong } = result.recordset[i];
      await sql.query(`
      UPDATE San_pham
      SET SL_da_ban = SL_da_ban + ${So_luong}
      WHERE Ma_san_pham = (
        SELECT Ma_san_pham
        FROM Mau_ma_san_pham
        WHERE ID = ${Mau_ma_sp}
      )`);
    }
    res.status(200).json({ message: "Xác nhận giao hàng thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi xác nhận giao hàng.",
      error: error.message,
    });
  }
};

module.exports = {
  signUpSeller,
  getSellerInfo,
  updateShop,
  getOrders,
  confirmOrder,
  confirmDelivery,
};

// CREATE DATABASE eCommerce;
// GO

// USE eCommerce;
// GO

// CREATE TABLE Nguoi_dung_va_Gio_hang (
//     Sdt CHAR(10) PRIMARY KEY,
//     Email VARCHAR(100) NOT NULL UNIQUE,
//     Mat_khau VARCHAR(100) NOT NULL,
//     Username VARCHAR(100) NOT NULL UNIQUE,
//     Ho_va_ten NVARCHAR(200),
//     Gioi_tinh CHAR CHECK (Gioi_tinh IN ('M', 'F')),
//     Ngay_sinh DATE,
//     La_nguoi_ban BIT DEFAULT 0,
// 	Url_avatar VARCHAR(200),
//     verificationCode INT,
//     isVerified BIT DEFAULT 0
// );

// CREATE TABLE Dia_chi (
//     Sdt CHAR(10),
// 	ID BIGINT PRIMARY KEY,
//     So_nha NVARCHAR(100) NOT NULL,
//     Phuong_or_Xa NVARCHAR(100) NOT NULL,
//     Quan_or_Huyen NVARCHAR(100) NOT NULL,
//     Tinh_or_TP NVARCHAR(100) NOT NULL,
//     FOREIGN KEY (Sdt) REFERENCES Nguoi_dung_va_Gio_hang(Sdt)
// );

// CREATE TABLE Nguoi_ban_va_Cua_hang (
//     Ma_cua_hang BIGINT PRIMARY KEY,
//     Ten NVARCHAR(200) NOT NULL,
//     Mo_ta NTEXT,
//     Url_logo VARCHAR(200),
// 	Sdt CHAR(10) NOT NULL,
// 	Dia_chi BIGINT NOT NULL,
//     FOREIGN KEY (Sdt) REFERENCES Nguoi_dung_va_Gio_hang(Sdt),
// 	FOREIGN KEY (Dia_chi) REFERENCES Dia_chi(ID)
// );

// CREATE TABLE Danh_muc_hang (
//     Ten_danh_muc NVARCHAR(400) PRIMARY KEY
// );

// CREATE TABLE San_pham (
//     Ma_san_pham BIGINT PRIMARY KEY,
//     Ten_san_pham NVARCHAR(400) NOT NULL,
// 	Xuat_xu NVARCHAR(200),
//     Thuong_hieu NVARCHAR(200),
//     Mo_ta NTEXT,
//     Gia INT NOT NULL,
// 	Url_thumbnail VARCHAR(200) NOT NULL,
// 	SL_da_ban INT DEFAULT 0,
//     Ma_cua_hang BIGINT NOT NULL,
//     Ten_danh_muc NVARCHAR(400) NOT NULL,
// 	Thoi_gian_tao SMALLDATETIME NOT NULL,
//     FOREIGN KEY (Ma_cua_hang) REFERENCES Nguoi_ban_va_Cua_hang(Ma_cua_hang),
//     FOREIGN KEY (Ten_danh_muc) REFERENCES Danh_muc_hang(Ten_danh_muc)
// );

// CREATE TABLE Hinh_anh_san_pham (
//     Ma_san_pham BIGINT NOT NULL,
//     Url_hinh_anh VARCHAR(200) PRIMARY KEY,
//     FOREIGN KEY (Ma_san_pham) REFERENCES San_pham(Ma_san_pham)
// );

// CREATE TABLE Mau_ma_san_pham (
// 	ID BIGINT PRIMARY KEY,
//     Ma_san_pham BIGINT NOT NULL,
//     Mau_sac NVARCHAR(200) NOT NULL,
//     Kich_co NVARCHAR(100) NOT NULL,
//     So_luong_ton_kho INT NOT NULL,
//     FOREIGN KEY (Ma_san_pham) REFERENCES San_pham(Ma_san_pham)
// );

// CREATE TABLE Don_hang (
//     Ma_don_hang BIGINT PRIMARY KEY,
//     Thoi_gian_dat_hang SMALLDATETIME NOT NULL,
//     Ngay_du_kien_giao DATE NOT NULL,
//     Trang_thai NVARCHAR(100) NOT NULL CHECK (Trang_thai IN('Chờ xác nhận','Đang giao hàng','Đã giao thành công','Đã hủy')) DEFAULT 'Chờ xác nhận',
//     Phi_giao_hang INT NOT NULL,
//     Thoi_gian_giao_hang SMALLDATETIME,
//     Ly_do_huy NVARCHAR(400),
//     Sdt CHAR(10) NOT NULL,
//     Ma_cua_hang BIGINT NOT NULL,
// 	Dia_chi_giao_hang BIGINT NOT NULL,
//     FOREIGN KEY (Sdt) REFERENCES Nguoi_dung_va_Gio_hang(Sdt),
//     FOREIGN KEY (Ma_cua_hang) REFERENCES Nguoi_ban_va_Cua_hang(Ma_cua_hang),
// 	FOREIGN KEY (Dia_chi_giao_hang) REFERENCES Dia_chi(ID)
// );

// CREATE TABLE Chi_tiet_don_hang (
//     Ma_don_hang BIGINT NOT NULL,
//     Mau_ma_sp BIGINT NOT NULL,
//     So_luong SMALLINT NOT NULL,
//     PRIMARY KEY (Ma_don_hang, Mau_ma_sp),
//     FOREIGN KEY (Ma_don_hang) REFERENCES Don_hang(Ma_don_hang),
//     FOREIGN KEY (Mau_ma_sp) REFERENCES Mau_ma_san_pham(ID)
// );

// CREATE TABLE Chi_tiet_Gio_hang (
//     Sdt CHAR(10) NOT NULL,
//     Mau_ma_sp BIGINT NOT NULL,
//     So_luong SMALLINT NOT NULL,
//     PRIMARY KEY (Sdt, Mau_ma_sp),
//     FOREIGN KEY (Sdt) REFERENCES Nguoi_dung_va_Gio_hang(Sdt),
//     FOREIGN KEY (Mau_ma_sp) REFERENCES Mau_ma_san_pham(ID)
// );

// CREATE TABLE Danh_gia (
//     Sdt CHAR(10) NOT NULL,
//     Ma_san_pham BIGINT NOT NULL,
//     Thoi_gian SMALLDATETIME NOT NULL,
//     Diem_danh_gia TINYINT NOT NULL CHECK (Diem_danh_gia >0 AND Diem_danh_gia <6),
//     Nhan_xet NTEXT,
//     Url_hinh_anh VARCHAR(200),
//     PRIMARY KEY (Sdt, Ma_san_pham, Thoi_gian),
//     FOREIGN KEY (Sdt) REFERENCES Nguoi_dung_va_Gio_hang(Sdt),
//     FOREIGN KEY (Ma_san_pham) REFERENCES San_pham(Ma_san_pham)
// );
// GO
