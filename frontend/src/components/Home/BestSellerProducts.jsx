import React from 'react';
import './BestSellerProducts.css';

const products = [
  {
    id: 1,
    name: 'iPhone 14 Pro Max 256GB',
    price: '29,000,000 VND',
    image: 'https://via.placeholder.com/150', // Thay bằng link ảnh thật
    supplier: 'Amazon Ltd',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'MacBook Pro M2 256GB',
    price: '35,000,000 VND',
    image: 'https://via.placeholder.com/150',
    supplier: 'Apple Inc.',
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Fashionable Watch 2023',
    price: '1,500,000 VND',
    image: 'https://via.placeholder.com/150',
    supplier: 'Shahriar Watch House',
    rating: 4.2,
  },
  // Thêm các sản phẩm khác
];

const BestSellerProducts = () => {
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

  return (
    <div className="best-seller-section">
      <h2>Sản phẩm bán chạy</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <span className="supplier">{product.supplier}</span>
              <h3 className="product-name">{product.name}</h3>
              <div className="rating">{renderStars(product.rating)}</div>
              <p className="price">{product.price}</p>
            </div>
            <button className="wishlist-btn">❤</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellerProducts;
