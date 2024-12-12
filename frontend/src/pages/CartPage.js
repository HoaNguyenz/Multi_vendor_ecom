import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ProductDetailPopup from "../components/Product/ProductDetailPopup";

const CartPage = () => {
  const { cartItems, updateCartItemQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null); // Sản phẩm đang được chọn
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Trạng thái của popup

  const handleIncrease = (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) updateCartItemQuantity(id, item.quantity + 1);
  };

  const handleDecrease = (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item.quantity > 1) {
      updateCartItemQuantity(id, item.quantity - 1);
    }
  };

  const handleSizeChange = (id, size) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      item.size = size; // Thay đổi size
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const openPopup = (product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setSelectedProduct(null);
    setIsPopupOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>

      {cartItems.length > 0 ? (
        <div>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center">
                  {/* Hình ảnh sản phẩm */}
                  <img
                    src={item.image || "https://via.placeholder.com/80"}
                    alt={item.name}
                    className="w-16 h-16 rounded-md cursor-pointer hover:opacity-80 transition"
                    onClick={() => openPopup(item)} // Mở popup khi click vào ảnh
                  />
                  {/* Thông tin sản phẩm */}
                  <div className="ml-4">
                    <p
                      className="font-medium text-blue-500 cursor-pointer hover:underline"
                      onClick={() => openPopup(item)} // Mở popup khi click vào tên
                    >
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Giá: {item.price.toLocaleString()} VND
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <label className="text-sm">
                        Size:
                        <select
                          value={item.size || "M"}
                          onChange={(e) =>
                            handleSizeChange(item.id, e.target.value)
                          }
                          className="ml-2 border p-1 rounded-md"
                        >
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Thao tác tăng/giảm/xóa */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleDecrease(item.id)}
                      className="p-2 bg-gray-200 rounded-md"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => handleIncrease(item.id)}
                      className="p-2 bg-gray-200 rounded-md"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tóm tắt và nút thanh toán */}
          <div className="mt-6 bg-gray-100 p-4 rounded-md shadow-md">
            <div className="flex justify-between mb-4">
              <p className="text-lg font-semibold">Tổng cộng:</p>
              <p className="text-lg font-bold">
                {calculateTotal().toLocaleString()} VND
              </p>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Thanh toán
            </button>
          </div>
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

export default CartPage;
