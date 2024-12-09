import React, { useEffect, useState } from 'react';
import axios from '../../context/configAxios'; // Thêm axios
import './BestSellerProducts.css';

const BestSellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products from backend
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/best-selling-products'); // Đảm bảo URL đúng
        setProducts(response.data);
      } catch (err) {
        setError(err.message || 'Lỗi khi lấy sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
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
          <div key={product.Ma_san_pham} className="product-card">
            <img
              src={product.Url_thumbnail}
              alt={product.Ten_san_pham}
              className="product-image"
            />
            <div className="product-info">
              <span className="supplier">{product.Thuong_hieu}</span>
              <h3 className="product-name">{product.Ten_san_pham}</h3>
              <div className="rating">{renderStars(product.SL_da_ban / 20)}</div>
              <p className="price">{product.Gia.toLocaleString('vi-VN')} VND</p>
            </div>
            <button className="wishlist-btn">❤</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellerProducts;
