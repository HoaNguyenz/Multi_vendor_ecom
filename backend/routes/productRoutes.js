const express = require("express");
const bcrypt = require("bcryptjs");
const { sql } = require("../db");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { verifyToken, jwtBlacklist, snowflake } = require("../middleware/verifyToken");
const router = express.Router();
require("dotenv").config();

// Route: Get Product Category
router.get("/get-categories", async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Danh_muc_hang`; // Lấy danh mục
    const categories = result.recordset.map((item) => item.Ten_danh_muc); // Lấy danh sách tên danh mục

    res.status(200).json(categories); // Trả về danh sách danh mục
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Lỗi hệ thống. Vui lòng thử lại.");
  }
});

// Route: Add Product Category
router.post("/add-category", verifyToken, async (req, res) => {
  const { ten_danh_muc } = req.body;

  if (!ten_danh_muc || typeof ten_danh_muc !== "string") {
    return res.status(400).json({ message: "Tên danh mục không hợp lệ." });
  }

  try {
    const pool = await sql.connect(); // Kết nối database
    await pool.request().input("ten_danh_muc", sql.NVarChar, ten_danh_muc)
      .query`INSERT INTO Danh_muc_hang (Ten_danh_muc) VALUES (@ten_danh_muc)`;

    res.status(201).json({ message: "Danh mục mới đã được thêm thành công." });
  } catch (error) {
    console.error("Error adding category:", error);
    res
      .status(500)
      .json({ message: "Có lỗi khi thêm danh mục.", error: error.message });
  }
});

// Route: Add Product
router.post("/add-product", verifyToken, async (req, res) => {
  const {
    ten_san_pham,
    xuat_xu,
    thuong_hieu,
    mo_ta,
    gia,
    url_thumbnail,
    ten_danh_muc,
    mau_ma_san_phams,
    hinh_anh_san_phams,
  } = req.body;
  const Sdt = req.user.id;

  try {
    if (
      mau_ma_san_phams === undefined ||
      hinh_anh_san_phams === undefined ||
      mau_ma_san_phams.length === 0 ||
      hinh_anh_san_phams.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Sản phẩm cần ít nhất một mẫu và một hình ảnh." });
    }
    const existingSeller =
      await sql.query`SELECT * FROM Nguoi_ban_va_Cua_hang WHERE Sdt = ${Sdt}`;
    if (existingSeller.recordset.length === 0) {
      return res
        .status(400)
        .json({ message: "Bạn cần đăng ký trở thành người bán trước." });
    }

    const Ma_cua_hang = existingSeller.recordset[0].Ma_cua_hang;

    const result = await sql.query`
              INSERT INTO San_pham (Ma_san_pham, Ten_san_pham, Xuat_xu, Thuong_hieu, Mo_ta, Gia, Url_thumbnail, SL_da_ban, Ma_cua_hang, Ten_danh_muc)
              OUTPUT INSERTED.Ma_san_pham
              VALUES (${snowflake.generate()}, ${ten_san_pham}, ${xuat_xu}, ${thuong_hieu}, ${mo_ta}, ${gia}, ${url_thumbnail}, 0, ${Ma_cua_hang}, ${ten_danh_muc});
          `;

    const Ma_san_pham = result.recordset[0].Ma_san_pham;

    for (let i = 0; i < mau_ma_san_phams.length; i++) {
      const { mau_sac, kich_co, so_luong_ton_kho } = mau_ma_san_phams[i];
      await sql.query`
                  INSERT INTO Mau_ma_san_pham (ID, Ma_san_pham, Mau_sac, Kich_co, So_luong_ton_kho)
                  VALUES (${snowflake.generate()}, ${Ma_san_pham}, ${mau_sac}, ${kich_co}, ${so_luong_ton_kho});
              `;
    }

    for (let i = 0; i < hinh_anh_san_phams.length; i++) {
      const url_hinh_anh = hinh_anh_san_phams[i];
      await sql.query`
                  INSERT INTO Hinh_anh_san_pham (Ma_san_pham, Url_hinh_anh)
                  VALUES (${Ma_san_pham}, ${url_hinh_anh});
              `;
    }

    res.status(201).json({
      message: "Thêm sản phẩm thành công.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Thêm sản phẩm không thành công. Vui lòng thử lại sau.",
      error: error.message,
    });
  }
});

// router.post('/add-product', verifyToken, async (req, res) => {
//   const {
//     ten_san_pham,
//     xuat_xu,
//     thuong_hieu,
//     mo_ta,
//     gia,
//     ten_danh_muc,
//     mau_ma_san_phams,
//     hinh_anh_san_phams,
//   } = req.body;
//   const Sdt = req.user.id;

//   try {
//     if (!hinh_anh_san_phams || hinh_anh_san_phams.length === 0) {
//       return res.status(400).json({ message: 'Vui lòng tải lên ít nhất một hình ảnh.' });
//     }

//     // Kiểm tra người bán
//     const existingSeller = await sql.query`
//       SELECT * FROM Nguoi_ban_va_Cua_hang WHERE Sdt = ${Sdt}`;
//     if (existingSeller.recordset.length === 0) {
//       return res.status(400).json({ message: 'Bạn cần đăng ký trở thành người bán trước.' });
//     }
//     const Ma_cua_hang = existingSeller.recordset[0].Ma_cua_hang;

//     // Upload hình ảnh lên Cloudinary
//     const uploadedImages = [];
//     for (const image of hinh_anh_san_phams) {
//       const result = await cloudinary.uploader.upload(image, {
//         folder: 'eCommerce_products', // Tên thư mục trên Cloudinary
//         use_filename: true,
//       });
//       uploadedImages.push(result.secure_url); // Lưu URL ảnh đã upload
//     }

//     // Thêm sản phẩm vào cơ sở dữ liệu
//     const result = await sql.query`
//       INSERT INTO San_pham (Ma_san_pham, Ten_san_pham, Xuat_xu, Thuong_hieu, Mo_ta, Gia, Url_thumbnail, SL_da_ban, Ma_cua_hang, Ten_danh_muc)
//       OUTPUT INSERTED.Ma_san_pham
//       VALUES (${snowflake.generate()}, ${ten_san_pham}, ${xuat_xu}, ${thuong_hieu}, ${mo_ta}, ${gia}, ${uploadedImages[0]}, 0, ${Ma_cua_hang}, ${ten_danh_muc});
//     `;
//     const Ma_san_pham = result.recordset[0].Ma_san_pham;

//     // Thêm thông tin size, màu sắc và tồn kho
//     for (const { mau_sac, kich_co, so_luong_ton_kho } of mau_ma_san_phams) {
//       await sql.query`
//         INSERT INTO Mau_ma_san_pham (ID, Ma_san_pham, Mau_sac, Kich_co, So_luong_ton_kho)
//         VALUES (${snowflake.generate()}, ${Ma_san_pham}, ${mau_sac}, ${kich_co}, ${so_luong_ton_kho});
//       `;
//     }

//     // Lưu URL hình ảnh
//     for (const url of uploadedImages) {
//       await sql.query`
//         INSERT INTO Hinh_anh_san_pham (Ma_san_pham, Url_hinh_anh)
//         VALUES (${Ma_san_pham}, ${url});
//       `;
//     }

//     res.status(201).json({ message: 'Thêm sản phẩm thành công.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: 'Thêm sản phẩm không thành công. Vui lòng thử lại sau.',
//       error: error.message,
//     });
//   }
// });


//Route: Get Filter Option
router.get("/filter-options", async (req, res) => {
  try {
    // Truy vấn để lấy các giá trị độc nhất cho bộ lọc
    const origins = await sql.query`SELECT DISTINCT Xuat_xu FROM San_pham WHERE Xuat_xu IS NOT NULL`;
    const brands = await sql.query`SELECT DISTINCT Thuong_hieu FROM San_pham WHERE Thuong_hieu IS NOT NULL`;
    const colors = await sql.query`SELECT DISTINCT Mau_sac FROM Mau_ma_san_pham WHERE Mau_sac IS NOT NULL`;
    const sizes = await sql.query`SELECT DISTINCT Kich_co FROM Mau_ma_san_pham WHERE Kich_co IS NOT NULL`;

    // Trả về kết quả
    res.status(200).json({
      origins: origins.recordset.map((row) => row.Xuat_xu),
      brands: brands.recordset.map((row) => row.Thuong_hieu),
      colors: colors.recordset.map((row) => row.Mau_sac),
      sizes: sizes.recordset.map((row) => row.Kich_co),
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    res.status(500).json({ message: "Lỗi hệ thống. Vui lòng thử lại." });
  }
});

// Route: Search Products
router.get("/search-products", async (req, res) => {
  const {
    keyword,
    origin,        // có thể là mảng
    brand,         // có thể là mảng
    priceMin,
    priceMax,
    color,         // có thể là mảng
    size,          // có thể là mảng
    inStock,
    category,
  } = req.query;

  try {
    let query = `
      SELECT sp.*, mms.Mau_sac, mms.Kich_co, mms.So_luong_ton_kho
      FROM San_pham sp
      LEFT JOIN Mau_ma_san_pham mms ON sp.Ma_san_pham = mms.Ma_san_pham
      WHERE 1 = 1
    `;

    // Thêm các điều kiện lọc
    if (keyword) query += ` AND sp.Ten_san_pham COLLATE Latin1_General_CI_AI LIKE N'%${keyword}%'`;
    if (category) query += ` AND sp.Ten_danh_muc = N'${category}'`;

    // Xử lý mảng (nếu `origin` là mảng, chuyển thành chuỗi để dùng trong `IN`)
    if (origin) {
      const origins = Array.isArray(origin) ? origin : [origin];
      query += ` AND sp.Xuat_xu IN (${origins.map((o) => `N'${o}'`).join(",")})`;
    }

    if (brand) {
      const brands = Array.isArray(brand) ? brand : [brand];
      query += ` AND sp.Thuong_hieu IN (${brands.map((b) => `N'${b}'`).join(",")})`;
    }

    if (priceMin) query += ` AND sp.Gia >= ${priceMin}`;
    if (priceMax) query += ` AND sp.Gia <= ${priceMax}`;

    if (color) {
      const colors = Array.isArray(color) ? color : [color];
      query += ` AND mms.Mau_sac IN (${colors.map((c) => `N'${c}'`).join(",")})`;
    }

    if (size) {
      const sizes = Array.isArray(size) ? size : [size];
      query += ` AND mms.Kich_co IN (${sizes.map((s) => `N'${s}'`).join(",")})`;
    }

    if (inStock) {
      if (inStock === "true" || inStock === 1) {
        query += ` AND mms.So_luong_ton_kho > 0`;
      } else if (inStock === "false" || inStock === 0) {
        query += ` AND mms.So_luong_ton_kho = 0`;
      }
    }

    // Thêm phần phân trang
    // query += ` ORDER BY sp.Ma_san_pham OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;`;

    // Thực hiện truy vấn
    const products = await sql.query(query);

    if (products.recordset.length === 0) {
      return res.status(404).json({
        message: "Không có sản phẩm nào phù hợp với yêu cầu tìm kiếm.",
      });
    }

    res.json(products.recordset);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi lấy sản phẩm." });
  }
});

// Route: View Product Information
router.get("/product/:id", verifyToken, async (req, res) => {
  const productId = req.params.id;

  try {
    // Truy vấn cơ sở dữ liệu để lấy thông tin sản phẩm theo ID
    const result = await sql.query`
              SELECT * FROM San_pham WHERE Id_san_pham = ${productId}
          `;

    const product = result.recordset[0];

    // Kiểm tra xem sản phẩm có tồn tại không
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tìm thấy." });
    }

    // Trả về thông tin sản phẩm
    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin sản phẩm.", error });
  }
});

// Route: Get Detail Product
router.get("/product-detail/:id", verifyToken, async (req, res) => {
  const Ma_san_pham = req.params.id;

  try {
    const result = await sql.query`
              SELECT * FROM San_pham WHERE Ma_san_pham = ${Ma_san_pham}
          `;

    const product = result.recordset[0];

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tìm thấy." });
    }

    const mauMaResult = await sql.query`
              SELECT * FROM Mau_ma_san_pham WHERE Ma_san_pham = ${Ma_san_pham}
          `;
    const mauMa = mauMaResult.recordset;

    const hinhAnhResult = await sql.query`
              SELECT * FROM Hinh_anh_san_pham WHERE Ma_san_pham = ${Ma_san_pham}
          `;
    const hinhAnh = hinhAnhResult.recordset;

    product.mau_ma_san_phams = mauMa.map((item) => ({
      mau_sac: item.Mau_sac,
      kich_co: item.Kich_co,
      so_luong_ton_kho: item.So_luong_ton_kho,
    }));
    product.hinh_anh_san_phams = hinhAnh.map((item) => item.Url_hinh_anh);

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi lấy thông tin sản phẩm.",
      error: error.message,
    });
  }
});

// Route: Get Best Selling Products
router.get("/best-selling-products", async (req, res) => {
  try {
    const result = await sql.query`
              SELECT TOP 10 * FROM San_pham ORDER BY SL_da_ban DESC
          `;

    const products = result.recordset;

    if (products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách sản phẩm.",
      error: error.message,
    });
  }
});

// Route: GET /product-seller
router.get("/product-seller", verifyToken, async (req, res) => {
  const Sdt = req.user.id; // Sdt của người bán từ token

  try {
    const result = await sql.query`
        SELECT 
            sp.Ma_san_pham,
            sp.Ten_san_pham,
            sp.Gia,
            sp.SL_da_ban,
            sp.Ten_danh_muc,
            sp.Ngay_tao,
            sp.Url_thumbnail,
            ISNULL(SUM(msp.So_luong_ton_kho), 0) AS Ton_kho
        FROM San_pham sp
        LEFT JOIN Mau_ma_san_pham msp ON sp.Ma_san_pham = msp.Ma_san_pham
        WHERE sp.Ma_cua_hang = (
          SELECT Ma_cua_hang 
          FROM Nguoi_ban_va_Cua_hang 
          WHERE Sdt = ${Sdt}
        )
        GROUP BY sp.Ma_san_pham, sp.Ten_san_pham, sp.Gia, sp.SL_da_ban, sp.Ten_danh_muc, sp.Ngay_tao, sp.Url_thumbnail
      `;

    const products = result.recordset;

    if (products.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách sản phẩm.",
      error: error.message,
    });
  }
});

module.exports = router;
