const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");

async function addAddress(req, res, next) {
  const schema = Joi.object({
    so_nha: Joi.string().required().trim().strict(),
    phuong_or_xa: Joi.string().required().trim().strict(),
    quan_or_huyen: Joi.string().required().trim().strict(),
    tinh_or_tp: Joi.string().required().trim().strict(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ error: error.details[0].message });
  }
}

async function updateAddress(req, res, next) {
  const schema = Joi.object({
    So_nha: Joi.string().required().trim().strict(),
    Phuong_or_Xa: Joi.string().required().trim().strict(),
    Quan_or_Huyen: Joi.string().required().trim().strict(),
    Tinh_or_TP: Joi.string().required().trim().strict(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ error: error.details[0].message });
  }
}

module.exports = { addAddress, updateAddress };

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
