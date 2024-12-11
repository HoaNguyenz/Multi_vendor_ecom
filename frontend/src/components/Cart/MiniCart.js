import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const MiniCart = () => {
  const { cartItems } = useCart(); // Lấy danh sách sản phẩm từ context
  const navigate = useNavigate();

  const handleNavigateToDetail = (productId) => {
    navigate(`/product/${productId}`); // Điều hướng đến trang chi tiết sản phẩm
  };

  return (
    <div className="fixed top-16 right-4 bg-white shadow-lg w-[300px] rounded-md overflow-hidden z-50">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Giỏ hàng</h2>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="p-4 max-h-[300px] overflow-y-auto space-y-4">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center border-b pb-4 last:border-b-0 cursor-pointer"
              onClick={() => handleNavigateToDetail(item.id)} // Khi bấm vào sản phẩm
            >
              {/* Hình ảnh sản phẩm */}
              <img
                src={item.image || "https://via.placeholder.com/80"}
                alt={item.name}
                className="w-16 h-16 rounded-md"
              />
              {/* Thông tin sản phẩm */}
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-sm text-gray-500">{item.price.toLocaleString()} VND</p>
                <p className="text-xs text-gray-400">Số lượng: {item.quantity}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Giỏ hàng trống</p>
        )}
      </div>

      {/* Nút điều hướng đến trang giỏ hàng */}
      {cartItems.length > 0 && (
        <div className="p-4 border-t">
          <button
            onClick={() => navigate("/cart")}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Đi đến giỏ hàng
          </button>
        </div>
      )}
    </div>
  );
};

export default MiniCart;
