const { sql } = require("../db");
const { snowflake } = require("../utils");

const getUserInfo = async (req, res) => {
  const { username } = req.params;

  try {
    const result = await sql.query`
      SELECT 
        Sdt, Email, Username, Ho_va_ten, Gioi_tinh, Ngay_sinh, 
        La_nguoi_ban, Url_avatar
      FROM Nguoi_dung_va_Gio_hang
      WHERE Username = ${username}
    `;

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]); // Chỉ trả về thông tin người dùng
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
  let { sdt, ho_va_ten, gioi_tinh, ngay_sinh, url_avatar } = req.body;
  // console.log(req.body);

  try {
    // Update user information in the Nguoi_dung_va_Gio_hang table
    if (!url_avatar) {
      await sql.query`
      UPDATE Nguoi_dung_va_Gio_hang 
      SET 
        Ho_va_ten = ${ho_va_ten}, 
        Gioi_tinh = ${gioi_tinh}, 
        Ngay_sinh = ${ngay_sinh}
      WHERE Sdt = ${sdt}
    `;
    } else {
      await sql.query`
          UPDATE Nguoi_dung_va_Gio_hang 
          SET 
            Ho_va_ten = ${ho_va_ten}, 
            Gioi_tinh = ${gioi_tinh}, 
            Ngay_sinh = ${ngay_sinh},
            Url_avatar = ${url_avatar}
          WHERE Sdt = ${sdt}
        `;
    }

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
  console.log(req.body);
  if (so_luong <= 0) {
    throw new Error("Số lượng sản phẩm phải lớn hơn 0.");
  }
  const sdt = req.user.id;

  try {
    const mmsp = await sql.query(`select So_luong_ton_kho from Mau_ma_san_pham
where ID = ${mau_ma_sp}`);

    const ton_kho = mmsp.recordset[0].So_luong_ton_kho;
    // Check if the product is already in the cart

    if (so_luong > ton_kho) {
      throw new Error("Số lượng sản phẩm trong kho không đủ.");
    }
    const checkProduct = await sql.query(`
        SELECT * FROM Chi_tiet_Gio_hang
        WHERE Sdt = '${sdt}' AND Mau_ma_sp = ${mau_ma_sp}
      `);

    if (checkProduct.recordset.length > 0) {
      // Update the quantity of the product in the cart
      if (so_luong + checkProduct.recordset[0].So_luong > ton_kho) {
        throw new Error("Số lượng sản phẩm trong kho không đủ.");
      }
      await sql.query(`
          UPDATE Chi_tiet_Gio_hang
          SET So_luong = So_luong + ${so_luong}
          WHERE Sdt = '${sdt}' AND Mau_ma_sp = ${mau_ma_sp}
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
    err = error.message;
    res
      .status(500)
      .json({ message: "Thêm sản phẩm vào giỏ hàng thất bại", err });
  }
};

const deleteFromCart = async (req, res) => {
  const { mau_ma_sp } = req.body;
  const sdt = req.user.id;

  try {
    const result = await sql.query(`
        DELETE FROM Chi_tiet_Gio_hang
        WHERE Sdt = ${sdt} AND Mau_ma_sp = ${mau_ma_sp}
      `);

    if (result.rowsAffected == 0) {
      throw new Error("Sản phẩm không tồn tại trong giỏ hàng.");
    }

    res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng." });
  } catch (error) {
    console.error(error);
    err = error.message;
    res
      .status(500)
      .json({ message: "Xóa sản phẩm khỏi giỏ hàng thất bại", err });
  }
};

const getCart = async (req, res) => {
  const sdt = req.user.id;
  try {
    //     const result2 = await sql.query(`
    // select Ten_san_pham, Url_thumbnail, Xuat_xu, Thuong_hieu, Gia, Mau_sac, Kich_co, So_luong, Mau_ma_sp, Ma_cua_hang
    // from Chi_tiet_Gio_hang
    // join Mau_ma_san_pham mmsp on Mau_ma_sp = ID
    // join San_pham sp on mmsp.Ma_san_pham = sp.Ma_san_pham
    // where sdt = '${sdt}'
    // `);
    //     res.status(200).json(result2.recordset);
    //     return;

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
          sp.Url_thumbnail,
          sp.Ma_san_pham,
          sp.Ma_cua_hang
        FROM Chi_tiet_Gio_hang AS ctgh
        JOIN Mau_ma_san_pham AS mm ON ctgh.Mau_ma_sp = mm.ID
        JOIN San_pham AS sp ON mm.Ma_san_pham = sp.Ma_san_pham
        WHERE ctgh.Sdt = ${sdt}
      `;

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
    err = error.message;
    res.status(500).json({ message: "Lấy thông tin giỏ hàng thất bại", err });
  }
};

// const updateCart = async (req, res) => {
//   const { mau_ma_sp, so_luong } = req.body;
//   const sdt = req.user.id;
//   if (so_luong <= 0) {
//     throw new Error("Số lượng sản phẩm phải lớn hơn 0.");
//   }

//   try {
//     const ton_kho_query = await sql.query(`
//       SELECT So_luong_ton_kho
//       FROM Mau_ma_san_pham
//       WHERE ID = ${mau_ma_sp}
//     `);
//     const ton_kho = ton_kho_query.recordset[0]?.So_luong_ton_kho;
//     console.log(ton_kho);
//     if (!ton_kho) {
//       throw new Error("Không tìm thấy sản phẩm với mã màu sắc này.");
//     }
//     // const ton_kho = mmsp.recordset[0].So_luong_ton_kho;
//     if (so_luong > ton_kho) {
//       throw new Error("Số lượng sản phẩm trong kho không đủ.");
//     }

//     const result = await sql.query(`
//         UPDATE Chi_tiet_Gio_hang
//         SET So_luong = ${so_luong}
//         WHERE Sdt = ${sdt} AND Mau_ma_sp = ${mau_ma_sp}
//       `);
//     if (result.rowsAffected == 0) {
//       throw new Error("Sản phẩm không tồn tại trong giỏ hàng.");
//     }

//     res.status(200).json({ message: "Đã cập nhật giỏ hàng." });
//   } catch (error) {
//     console.error(error);
//     err = error.message;
//     res.status(500).json({ message: "Cập nhật giỏ hàng thất bại", err });
//   }
// };
const updateCart = async (req, res) => {
  const { mau_ma_sp, so_luong } = req.body;
  const sdt = req.user.id;

  if (so_luong <= 0) {
    return res
      .status(400)
      .json({ message: "Số lượng sản phẩm phải lớn hơn 0." });
  }

  try {
    const ton_kho_query = await sql.query(`
      SELECT So_luong_ton_kho 
      FROM Mau_ma_san_pham 
      WHERE ID = ${mau_ma_sp}
    `);

    const ton_kho = ton_kho_query.recordset[0]?.So_luong_ton_kho;
    console.log(ton_kho);
    if (!ton_kho) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    if (so_luong > ton_kho) {
      return res
        .status(400)
        .json({ message: "Số lượng sản phẩm trong kho không đủ." });
    }

    const result = await sql.query(`
      UPDATE Chi_tiet_Gio_hang
      SET So_luong = ${so_luong}
      WHERE Sdt = '${sdt}' AND Mau_ma_sp = ${mau_ma_sp}
    `);

    if (result.rowsAffected[0] === 0) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại trong giỏ hàng." });
    }

    res.status(200).json({ message: "Đã cập nhật giỏ hàng." });
  } catch (error) {
    console.error("Error in updateCart:", error.message, error.stack);
    res
      .status(500)
      .json({ message: "Cập nhật giỏ hàng thất bại", error: error.message });
  }
};

const createOrder = async (req, res) => {
  const { dia_chi_giao_hang, phi_giao_hang, chi_tiet_don_hang } = req.body;
  const sdt = req.user.id;

  const soNgay = 3; // Thời gian giao hàng dự kiến (sau 3 ngày)

  try {
    // Tách các sản phẩm theo mã cửa hàng
    const groupedByStore = chi_tiet_don_hang.reduce((acc, item) => {
      const storeId = item.ma_cua_hang;
      if (!acc[storeId]) {
        acc[storeId] = [];
      }
      acc[storeId].push(item);
      return acc;
    }, {});
    console.log(groupedByStore);
    // Lặp qua từng nhóm cửa hàng và tạo đơn hàng cho từng nhóm
    for (const storeId in groupedByStore) {
      const orderDetails = groupedByStore[storeId];
      const ma_don_hang = snowflake.generate(); // Tạo mã đơn hàng cho mỗi cửa hàng

      // Tính tổng giá trị đơn hàng cho cửa hàng hiện tại
      const totalPrice = orderDetails.reduce(
        (total, item) => total + item.gia * item.so_luong,
        0
      );
      const tongGia = totalPrice + phi_giao_hang; // Tổng giá = Tổng giá sản phẩm + phí giao hàng

      // Tạo đơn hàng cho cửa hàng hiện tại
      await sql.query(`
        INSERT INTO Don_hang (Ma_don_hang, Thoi_gian_dat_hang, Ngay_du_kien_giao, Phi_giao_hang, Sdt, Ma_cua_hang, Dia_chi_giao_hang, Tong_gia)
        VALUES (${ma_don_hang}, GETDATE(), DATEADD(day, ${soNgay}, GETDATE()), ${phi_giao_hang}, '${sdt}', ${storeId}, ${dia_chi_giao_hang}, ${tongGia})
      `);

      // Thêm chi tiết đơn hàng cho cửa hàng hiện tại
      for (let i = 0; i < orderDetails.length; i++) {
        await sql.query(`
          INSERT INTO Chi_tiet_don_hang (Ma_don_hang, Mau_ma_sp, So_luong)
          VALUES (${ma_don_hang}, ${orderDetails[i].mau_ma_sp}, ${orderDetails[i].so_luong})
        `);
      }
    }

    res.status(200).json({ message: "Đã tạo đơn hàng." });
  } catch (error) {
    console.error(error);
    const err = error.message;
    res.status(500).json({ message: "Tạo đơn hàng thất bại", err });
  }
};

const cancelOrder = async (req, res) => {
  const { ma_don_hang, ly_do_huy } = req.body;
  console.log(req.body);
  const sdt = req.user.id;

  try {
    await sql.query(`
        UPDATE Don_hang
        SET Trang_thai = N'Đã hủy', Ly_do_huy = N'${ly_do_huy}'
        WHERE Ma_don_hang = ${ma_don_hang}
      `);

    res.status(200).json({ message: "Đã hủy đơn hàng." });
  } catch (error) {
    console.error(error);
    const err = error.message;
    res.status(500).json({ message: "Hủy đơn hàng thất bại", err });
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
            dh.Thoi_gian_giao_thuc_te,
            dh.Ly_do_huy,
            dh.Sdt,
            dh.Ma_cua_hang,
            dh.Dia_chi_giao_hang,
            dh.Tong_gia
          FROM Don_hang AS dh
          WHERE dh.Sdt = ${sdt} AND dh.Trang_thai = ${trang_thai} AND dh.Ma_cua_hang != -1
        `;
    } else {
      result = await sql.query`
          SELECT 
            dh.Ma_don_hang,
            dh.Thoi_gian_dat_hang,
            dh.Ngay_du_kien_giao,
            dh.Trang_thai,
            dh.Phi_giao_hang,
            dh.Thoi_gian_giao_thuc_te,
            dh.Ly_do_huy,
            dh.Sdt,
            dh.Ma_cua_hang,
            dh.Dia_chi_giao_hang,
            dh.Tong_gia
          FROM Don_hang AS dh
          WHERE dh.Sdt = ${sdt} AND dh.Ma_cua_hang != -1
        `;
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lấy thông tin đơn hàng thất bại", error });
  }
};

const addAddress = async (req, res) => {
  // console.log("Request Body:", req.body);
  const { so_nha, phuong_or_xa, quan_or_huyen, tinh_or_tp } = req.body;
  const sdt = req.user.id;
  const id = snowflake.generate();
  // console.log(sdt);
  // console.log({ so_nha, phuong_or_xa, quan_or_huyen, tinh_or_tp });
  try {
    await sql.query`
        INSERT INTO Dia_chi (Sdt, ID, So_nha, Phuong_or_Xa, Quan_or_Huyen, Tinh_or_TP)
        VALUES (${sdt}, ${id}, ${so_nha}, ${phuong_or_xa}, ${quan_or_huyen}, ${tinh_or_tp})
      `;

    res.status(200).json({ message: "Đã thêm địa chỉ giao hàng." });
  } catch (error) {
    console.error(error);
    err = error.message;
    res.status(500).json({ message: "Thêm địa chỉ giao hàng thất bại", err });
  }
};

const getAddress = async (req, res) => {
  const sdt = req.user.id;
  try {
    const result = await sql.query(`
        SELECT * FROM Dia_chi
        WHERE Sdt = '${sdt}'
      `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
    err = error.message;
    res.status(500).json({ message: "Lấy thông tin địa chỉ thất bại", err });
  }
};

const updateAddress = async (req, res) => {
  const { so_nha, phuong_or_xa, quan_or_huyen, tinh_or_tp } = req.body;
  const { id } = req.params;

  try {
    const result = await sql.query`
        UPDATE Dia_chi
        SET So_nha = ${so_nha}, Phuong_or_Xa = ${phuong_or_xa}, Quan_or_Huyen = ${quan_or_huyen}, Tinh_or_TP = ${tinh_or_tp}
        WHERE ID = ${id}
      `;

    if (result.rowsAffected == 0) {
      throw new Error("Địa chỉ không tồn tại.");
    }
    res.status(200).json({ message: "Đã cập nhật địa chỉ giao hàng." });
  } catch (error) {
    console.error(error);
    err = error.message;
    res
      .status(500)
      .json({ message: "Cập nhật địa chỉ giao hàng thất bại", err });
  }
};

const deleteAddress = async (req, res) => {
  const { id } = req.params;

  try {
    await sql.query(`
        DELETE FROM Dia_chi
        WHERE ID = ${id}
      `);

    res.status(200).json({ message: "Đã xóa địa chỉ giao hàng." });
  } catch (error) {
    console.error(error);
    err = error.message;
    res.status(500).json({ message: "Xóa địa chỉ giao hàng thất bại", err });
  }
};

// Đánh giá sản phẩm
const addReview = async (req, res) => {
  const {
    sdt,
    maSanPham,
    diemDanhGia,
    nhanXet,
    urlHinhAnh,
    mauMaSp,
    maDonHang,
  } = req.body;

  if (
    !sdt ||
    !maSanPham ||
    !diemDanhGia ||
    diemDanhGia < 1 ||
    diemDanhGia > 5
  ) {
    return res.status(400).json({ message: "Dữ liệu không hợp lệ!" });
  }

  try {
    const insertQuery = `
      INSERT INTO Danh_gia (Sdt, Ma_san_pham, Thoi_gian, Diem_danh_gia, Nhan_xet, Url_hinh_anh, Ma_don_hang)
      VALUES (@sdt, @maSanPham, GETDATE(), @diemDanhGia, @nhanXet, @urlHinhAnh, @maDonHang)
    `;

    const request = new sql.Request();
    request.input("sdt", sql.Char(10), sdt);
    request.input("maSanPham", sql.BigInt, maSanPham);
    request.input("diemDanhGia", sql.TinyInt, diemDanhGia);
    request.input("nhanXet", sql.NText, nhanXet || null);
    request.input("urlHinhAnh", sql.VarChar(200), urlHinhAnh || null);
    request.input("mauMaSp", sql.BigInt, mauMaSp);
    request.input("maDonHang", sql.BigInt, maDonHang);

    await request.query(insertQuery);

    const updateQuery = `
      UPDATE Chi_tiet_don_hang
      SET Da_danh_gia = 1
      WHERE Mau_ma_sp = @mauMaSp AND Ma_don_hang IN (SELECT Ma_don_hang FROM Don_hang WHERE Sdt = @sdt)
    `;

    await request.query(updateQuery);

    res.status(201).json({ message: "Đánh giá đã được thêm thành công!" });
  } catch (err) {
    console.error("Lỗi khi đánh giá sản phẩm.", err);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

// Xem đánh giá của một sản phẩm
const getReview = async (req, res) => {
  const { maSanPham } = req.params;

  try {
    const query = `
      SELECT Sdt, Diem_danh_gia AS DiemDanhGia, Nhan_xet AS NhanXet, Url_hinh_anh AS UrlHinhAnh, Thoi_gian AS ThoiGian
      FROM Danh_gia
      WHERE Ma_san_pham = @maSanPham
      ORDER BY Thoi_gian DESC
    `;

    const request = new sql.Request();
    request.input("maSanPham", sql.BigInt, maSanPham);

    const result = await request.query(query);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Lỗi khi xem đánh giá sản phẩm.", err);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

const productInOrder = async (req, res) => {
  const { maDonHang } = req.params;

  try {
    const result = await sql.query(
      `
      SELECT 
        sp.Ma_san_pham,
        sp.Ten_san_pham,
        mm.Mau_sac,
        mm.Kich_co AS Size,
        sp.Gia AS Don_gia,
        sp.Url_thumbnail,
        ct.So_luong,
        ct.Da_danh_gia,
        (ct.So_luong * sp.Gia) AS Thanh_tien,
        dh.Ma_cua_hang,
        dh.Phi_giao_hang,
        dh.Sdt,
        ct.Mau_ma_sp,
        ncc.Ten AS Ten_cua_hang,
        ncc.Url_logo,
        dc.So_nha,
        dc.Phuong_or_Xa,
        dc.Quan_or_Huyen,
        dc.Tinh_or_TP
      FROM Chi_tiet_don_hang ct
      INNER JOIN Mau_ma_san_pham mm ON ct.Mau_ma_sp = mm.ID
      INNER JOIN San_pham sp ON mm.Ma_san_pham = sp.Ma_san_pham
      INNER JOIN Don_hang dh ON ct.Ma_don_hang = dh.Ma_don_hang
      INNER JOIN Nguoi_ban_va_Cua_hang ncc ON dh.Ma_cua_hang = ncc.Ma_cua_hang
      INNER JOIN Dia_chi dc ON ncc.Dia_chi = dc.ID
      WHERE ct.Ma_don_hang = ${maDonHang}
      `
    );

    // Xử lý kết quả
    if (!result.recordset || result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chi tiết đơn hàng" });
    }

    res.json(result.recordset);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getMyReview = async (req, res) => {
  const { maSanPham, maDonHang } = req.params;

  try {
    const query = `
      SELECT *
      FROM Danh_gia
      WHERE Ma_san_pham = @maSanPham AND Ma_don_hang = @maDonHang
    `;

    const request = new sql.Request();
    request.input("maSanPham", sql.BigInt, maSanPham);
    request.input("maDonHang", sql.BigInt, maDonHang);

    const result = await request.query(query);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Lỗi khi xem đánh giá sản phẩm.", err);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

const getSellerInfoByStoreId = async (req, res) => {
  const { ma_cua_hang } = req.params;

  try {
    const result = await sql.query`
      SELECT *
      FROM Nguoi_ban_va_Cua_hang AS N
      JOIN Dia_chi AS D ON N.Dia_chi = D.ID
      WHERE N.Ma_cua_hang = ${ma_cua_hang}
    `;
    const seller = result.recordset[0];
    if (!seller) {
      return res.status(404).json({ message: "Cửa hàng không tồn tại." });
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

const getRatingsByStoreId = async (req, res) => {
  const { ma_cua_hang } = req.params; // Lấy mã cửa hàng từ params

  try {
    // Truy vấn để lấy tất cả đánh giá từ tất cả sản phẩm thuộc cửa hàng
    const query = `
      SELECT 
        dg.Diem_danh_gia
      FROM Danh_gia dg
      JOIN San_pham sp ON dg.Ma_san_pham = sp.Ma_san_pham
      WHERE sp.Ma_cua_hang = @MaCuaHang
    `;

    const request = new sql.Request();
    request.input("MaCuaHang", sql.BigInt, ma_cua_hang);

    const result = await request.query(query);

    // Tính điểm rating trung bình
    const ratings = result.recordset.map((item) => item.Diem_danh_gia);
    const totalRatings = ratings.length;
    const averageRating =
      totalRatings > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / totalRatings
        : 0;

    // Trả về kết quả
    res.status(200).json({
      totalRatings,
      averageRating: averageRating.toFixed(2), // Làm tròn đến 2 chữ số thập phân
    });
  } catch (error) {
    console.error("Lỗi khi lấy đánh giá:", error);
    res.status(500).json({
      message: "Lỗi khi lấy đánh giá.",
      error: error.message,
    });
  }
};

const getProductsByStoreId = async (req, res) => {
  const { ma_cua_hang } = req.params; // Lấy mã cửa hàng từ params
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;

  try {
    const result = await sql.query`
      SELECT 
          sp.Ma_san_pham,
          sp.Ten_san_pham,
          sp.Gia,
          sp.SL_da_ban,
          sp.Ten_danh_muc,
          sp.Thoi_gian_tao,
          sp.Url_thumbnail,
          ISNULL(SUM(msp.So_luong_ton_kho), 0) AS Ton_kho
      FROM San_pham sp
      LEFT JOIN Mau_ma_san_pham msp ON sp.Ma_san_pham = msp.Ma_san_pham
      WHERE sp.Ma_cua_hang = ${ma_cua_hang}
      GROUP BY sp.Ma_san_pham, sp.Ten_san_pham, sp.Gia, sp.SL_da_ban, sp.Ten_danh_muc, sp.Thoi_gian_tao, sp.Url_thumbnail
      ORDER BY sp.Thoi_gian_tao DESC
      OFFSET ${(page - 1) * limit} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;

    const products = result.recordset;
    if (products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào." });
    }

    let message = {};
    if (page == 1) {
      const countProduct = await sql.query`
        SELECT COUNT(*) as count
        FROM San_pham
        WHERE Ma_cua_hang = ${ma_cua_hang}
      `;
      const count = countProduct.recordset[0].count;
      const totalPages = Math.ceil(count / limit);
      message.totalPages = totalPages;
    }

    message.products = products;
    console.log(message);
    res.status(200).json(message);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách sản phẩm.",
      error: error.message,
    });
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
  addAddress,
  getAddress,
  updateAddress,
  deleteAddress,
  addReview,
  getReview,
  productInOrder,
  getMyReview,
  getSellerInfoByStoreId,
  getRatingsByStoreId,
  getProductsByStoreId,
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
