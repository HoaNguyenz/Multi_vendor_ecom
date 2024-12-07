import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCartPlus, FaRegEye } from "react-icons/fa";
import ProductDetailPopup from './ProductDetailPopup';

const ProductCard = ({ product }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control the popup visibility

  // Function to open the popup
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  // Function to close the popup
  const closePopup = () => {
    setIsPopupOpen(false);
  };
  return (
    <div className="w-full max-w-[300px] bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <div className="relative">
        {/* Image */}
        <img
          src={product.Url_thumbnail || "https://via.placeholder.com/150"}
          alt={product.Ten_san_pham}
          className="w-full h-[200px] object-cover rounded-lg"
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          {/* Cart Icon */}
          <button className="p-2 bg-white rounded-full hover:bg-gray-200">
            <FaCartPlus className="h-5 w-5 text-gray-700" />
          </button>
          {/* View Icon */}
          <button 
            className="p-2 bg-white rounded-full hover:bg-gray-200" 
            onClick={openPopup} // Trigger popup on click
          >
            <FaRegEye className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-900">{product.Ten_san_pham}</h3>
        <p className="text-sm text-gray-500">{product.Thuong_hieu}</p>
        <div className="flex items-center mt-2">
          {/* Rating */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => (
              <svg key={index} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" stroke="currentColor">
                <path fillRule="evenodd" d="M10 15l-3.618 2.409L7.52 12.09 4 8.591l4.82-.409L10 2l1.18 5.773L16 8.591l-3.52 3.499L13.618 17.41z" clipRule="evenodd" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.ratings}Ratings)</span>
        </div>
        
        {/* Price */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-semibold text-gray-900">{product.Gia} VND</span>
        </div>
        
        {/* Sold Count */}
        <p className="text-sm text-gray-600 mt-1">{product.SL_da_ban} Đã bán</p>
      </div>

      {/* Popup for product details */}
      {isPopupOpen && (
        <ProductDetailPopup
          setOpen={setIsPopupOpen} // Pass function to close the popup
          productData={product} // Pass product data to the popup
        />
      )}
    </div>
  );
};

export default ProductCard;
