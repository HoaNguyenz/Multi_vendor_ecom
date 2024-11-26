import React, { useState } from "react";

const Cart = () => {
  // Danh sách sản phẩm trong giỏ hàng
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Áo thun nam",
      price: 200000,
      quantity: 2,
      image: "https://via.placeholder.com/80",
    },
    {
      id: 2,
      name: "Quần jeans nữ",
      price: 350000,
      quantity: 1,
      image: "https://via.placeholder.com/80",
    },
  ]);

  // Tăng số lượng sản phẩm
  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  // Giảm số lượng sản phẩm
  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  // Xóa sản phẩm khỏi giỏ
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Tính tổng giỏ hàng
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="absolute top-14 right-4 bg-white shadow-lg w-[350px] rounded-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Giỏ hàng</h2>
      </div>
      <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-md"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.price.toLocaleString()} VND</p>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="bg-gray-300 px-2 py-1 rounded-full"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="bg-gray-300 px-2 py-1 rounded-full"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                X
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center">Giỏ hàng trống</p>
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Tổng cộng:</span>
            <span className="text-lg font-bold">
              {calculateTotal().toLocaleString()} VND
            </span>
          </div>
          <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
            Thanh toán
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
