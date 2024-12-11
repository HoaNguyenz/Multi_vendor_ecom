import React, { useState } from "react";
import { useCart } from "../context/CartContext"; // Sửa lại đường dẫn
import ProductDetailPopup from "../components/Product/ProductDetailPopup"; // Đường dẫn đúng

const Cart = () => {
  const { cartItems } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null); // Sản phẩm đang được chọn
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = (product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>

      {cartItems.length > 0 ? (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center border-b pb-4 cursor-pointer"
              onClick={() => openPopup(item)} // Mở popup chi tiết sản phẩm
            >
              {/* Hình ảnh sản phẩm */}
              <img
                src={item.image || "https://via.placeholder.com/80"}
                alt={item.name}
                className="w-20 h-20 rounded-md"
              />
              {/* Thông tin sản phẩm */}
              <div className="ml-4 flex-1">
                <p className="text-lg font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.price.toLocaleString()} VND
                </p>
                <p className="text-sm text-gray-400">
                  Số lượng: {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Giỏ hàng của bạn đang trống</p>
      )}

      {/* Popup chi tiết sản phẩm */}
      {isPopupOpen && selectedProduct && (
        <ProductDetailPopup
          setOpen={closePopup}
          productData={selectedProduct}
        />
      )}
    </div>
  );
};

export default Cart;
