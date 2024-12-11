const { sql } = require("../db");
const { snowflake } = require("../utils");

const getUserInfo = async (req, res) => {
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
    res
      .status(500)
      .json({ message: "Lỗi khi lấy thông tin người dùng", error });
  }
};

const updateUser = async (req, res) => {
  const { sdt, ho_va_ten, gioi_tinh, ngay_sinh, url_avatar } = req.body;
  console.log(gioi_tinh);

  try {
    // Update user information in the Nguoi_dung_va_Gio_hang table
    await sql.query`
        UPDATE Nguoi_dung_va_Gio_hang 
        SET 
          Ho_va_ten = ${ho_va_ten}, 
          Gioi_tinh = ${gioi_tinh}, 
          Ngay_sinh = ${ngay_sinh},
          Url_avatar = ${url_avatar}
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
};

const addToCart = async (req, res) => {
  const { mau_ma_sp, so_luong } = req.body;
  const sdt = req.user.id;
  try {
    // Check if the product is already in the cart
    const checkProduct = await sql.query(`
        SELECT * FROM Chi_tiet_Gio_hang
        WHERE Sdt = ${sdt} AND Mau_ma_sp = ${mau_ma_sp}
      `);

    if (checkProduct.recordset.length > 0) {
      // Update the quantity of the product in the cart
      await sql.query(`
          UPDATE Chi_tiet_Gio_hang
          SET So_luong = So_luong + ${so_luong}
          WHERE Sdt = ${sdt} AND Mau_ma_sp = ${mau_ma_sp}
        `);
    } else {
      // Add the product to the cart
      await sql.query`
          INSERT INTO Chi_tiet_Gio_hang (Sdt, Mau_ma_sp, So_luong)
          VALUES (${sdt}, ${mau_ma_sp}, ${so_luong})
        `;
    }

    res.status(200).json({ message: "Đã thêm sản phẩm vào giỏ hàng." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Thêm sản phẩm vào giỏ hàng thất bại", error });
  }
};

const deleteFromCart = async (req, res) => {
  const { mau_ma_sp } = req.body;
  const sdt = req.user.id;

  try {
    await sql.query`
        DELETE FROM Chi_tiet_Gio_hang
        WHERE Sdt = ${sdt} AND Mau_ma_sp = ${mau_ma_sp}
      `;

    res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Xóa sản phẩm khỏi giỏ hàng thất bại", error });
  }
};

const getCart = async (req, res) => {
  const sdt = req.user.id;
  try {
    const result = await sql.query`
        SELECT 
          ctgh.Sdt,
          ctgh.Mau_ma_sp,
          ctgh.So_luong,
          mm.Mau_sac,
          mm.Kich_co,
          mm.So_luong_ton_kho,
          sp.Ten_san_pham,
          sp.Gia,
          sp.Url_thumbnail
        FROM Chi_tiet_Gio_hang AS ctgh
        JOIN Mau_ma_san_pham AS mm ON ctgh.Mau_ma_sp = mm.ID
        JOIN San_pham AS sp ON mm.Ma_san_pham = sp.Ma_san_pham
        WHERE ctgh.Sdt = ${sdt}
      `;

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lấy thông tin giỏ hàng thất bại", error });
  }
};

const updateCart = async (req, res) => {
  const { mau_ma_sp, so_luong } = req.body;
  const sdt = req.user.id;

  try {
    await sql.query(`
        UPDATE Chi_tiet_Gio_hang
        SET So_luong = ${so_luong}
        WHERE Sdt = ${sdt} AND Mau_ma_sp = ${mau_ma_sp}
      `);

    res.status(200).json({ message: "Đã cập nhật giỏ hàng." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cập nhật giỏ hàng thất bại", error });
  }
};

const createOrder = async (req, res) => {
  const { dia_chi_giao_hang, phi_giao_hang, chi_tiet_don_hang } = req.body;
  const sdt = req.user.id;
  const ma_don_hang = snowflake.generate();

  try {
    // Create an order
    await sql.query(`
        INSERT INTO Don_hang (Ma_don_hang, Thoi_gian_dat_hang, Ngay_du_kien_giao, Trang_thai, Phi_giao_hang, Sdt, Dia_chi_giao_hang)
        VALUES (${ma_don_hang}, GETDATE(), DATEADD(day, 2, GETDATE()), 'Chờ xác nhận', ${phi_giao_hang}, ${sdt}, ${dia_chi_giao_hang})
      `);

    // Add order details
    for (let i = 0; i < chi_tiet_don_hang.length; i++) {
      await sql.query(`
          INSERT INTO Chi_tiet_don_hang (Ma_don_hang, Mau_ma_sp, So_luong)
          VALUES (${ma_don_hang}, ${chi_tiet_don_hang[i].mau_ma_sp}, ${chi_tiet_don_hang[i].so_luong})
        `);
    }

    res.status(200).json({ message: "Đã tạo đơn hàng." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Tạo đơn hàng thất bại", error });
  }
};

const cancelOrder = async (req, res) => {
  const { ma_don_hang, ly_do_huy } = req.body;
  const sdt = req.user.id;

  try {
    await sql.query(`
        UPDATE Don_hang
        SET Trang_thai = 'Đã hủy', Ly_do_huy = ${ly_do_huy}
        WHERE Ma_don_hang = ${ma_don_hang} AND Sdt = ${sdt}
      `);

    res.status(200).json({ message: "Đã hủy đơn hàng." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hủy đơn hàng thất bại", error });
  }
};

const getOrder = async (req, res) => {
  const sdt = req.user.id;
  const { trang_thai } = req.query;

  try {
    let result;
    if (trang_thai) {
      result = await sql.query`
          SELECT 
            dh.Ma_don_hang,
            dh.Thoi_gian_dat_hang,
            dh.Ngay_du_kien_giao,
            dh.Trang_thai,
            dh.Phi_giao_hang,
            dh.Thoi_gian_giao_hang,
            dh.Ly_do_huy,
            dh.Sdt,
            dh.Ma_cua_hang,
            dh.Dia_chi_giao_hang
          FROM Don_hang AS dh
          WHERE dh.Sdt = ${sdt} AND dh.Trang_thai = ${trang_thai}
        `;
    } else {
      result = await sql.query`
          SELECT 
            dh.Ma_don_hang,
            dh.Thoi_gian_dat_hang,
            dh.Ngay_du_kien_giao,
            dh.Trang_thai,
            dh.Phi_giao_hang,
            dh.Thoi_gian_giao_hang,
            dh.Ly_do_huy,
            dh.Sdt,
            dh.Ma_cua_hang,
            dh.Dia_chi_giao_hang
          FROM Don_hang AS dh
          WHERE dh.Sdt = ${sdt}
        `;
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lấy thông tin đơn hàng thất bại", error });
  }
};

module.exports = {
  getUserInfo,
  updateUser,
  addToCart,
  deleteFromCart,
  getCart,
  updateCart,
  createOrder,
  cancelOrder,
  getOrder,
};
