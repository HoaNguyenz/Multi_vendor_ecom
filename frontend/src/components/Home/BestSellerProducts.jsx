import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../context/configAxios"; // Đảm bảo axios đúng
import "./BestSellerProducts.css";

const BestSellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch sản phẩm bán chạy
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/best-selling-products");
        const productList = response.data;

        // Gọi thêm API để lấy rating cho từng sản phẩm
        const productsWithRatings = await Promise.all(
          productList.map(async (product) => {
            try {
              const reviewResponse = await axios.get(`/review/${product.Ma_san_pham}`);
              const reviews = reviewResponse.data;

              // Tính tổng điểm và trung bình rating
              const totalRatings = reviews.length;
              const totalScore = reviews.reduce((sum, review) => sum + review.DiemDanhGia, 0);
              const averageRating = totalRatings > 0 ? totalScore / totalRatings : 0;

              return { ...product, rating: averageRating, totalRatings };
            } catch {
              return { ...product, rating: 0, totalRatings: 0 }; // Mặc định 0 nếu lỗi
            }
          })
        );

        setProducts(productsWithRatings);
      } catch (err) {
        setError(err.message || "Lỗi khi lấy sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderStars = (rating) => {
    // Đảm bảo rating là số hợp lệ và nằm trong khoảng 0-5
    const validRating = Math.max(0, Math.min(5, isNaN(rating) ? 0 : rating));
  
    const fullStars = Math.floor(validRating);
    const halfStar = validRating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
    return (
      <>
        {Array(fullStars)
          .fill(null)
          .map((_, idx) => (
            <span key={`full-${idx}`} className="star full">★</span>
          ))}
        {halfStar && <span className="star half">★</span>}
        {Array(emptyStars)
          .fill(null)
          .map((_, idx) => (
            <span key={`empty-${idx}`} className="star empty">☆</span>
          ))}
      </>
    );
  };
  

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="best-seller-section">
      <h2>Sản phẩm bán chạy</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.Ma_san_pham} className="product-card" onClick={() => navigate(`/product/${product.Ma_san_pham}`)}>
            <img
              src={product.Url_thumbnail}
              alt={product.Ten_san_pham}
              className="product-image"
            />
            <div className="product-info">
              <span className="supplier">{product.Thuong_hieu}</span>
              <h3 className="product-name">{product.Ten_san_pham}</h3>
              <div className="rating">
                {renderStars(product.rating)} {/* Hiển thị sao */}
                <span className="text-sm">{product.rating.toFixed(1)} ({product.totalRatings})</span> {/* Hiển thị điểm */}
              </div>
              <p className="price">{product.Gia.toLocaleString("vi-VN")} VND</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellerProducts;
