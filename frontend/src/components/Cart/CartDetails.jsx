import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../context/configAxios";
import ProductDetailPopup from "../../components/Product/ProductDetailPopup";

const CartDetails = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]); // Dữ liệu giỏ hàng từ API
  const [selectedProduct, setSelectedProduct] = useState(null); // Sản phẩm đang được chọn
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Trạng thái của popup

  // Lấy thông tin giỏ hàng từ API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("/cart"); // Gọi API lấy giỏ hàng
        setCartItems(response.data); // Cập nhật state với dữ liệu giỏ hàng
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  const openPopup = (product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setSelectedProduct(null);
    setIsPopupOpen(false);
  };

  const handleIncrease = (id) => {
    const item = cartItems.find((item) => item.Mau_ma_sp === id);
    if (item) {
      // Cập nhật số lượng sản phẩm trong giỏ hàng
      item.So_luong += 1;
      setCartItems([...cartItems]);
    }
  };

  const handleDecrease = (id) => {
    const item = cartItems.find((item) => item.Mau_ma_sp === id);
    if (item && item.So_luong > 1) {
      // Giảm số lượng sản phẩm trong giỏ hàng
      item.So_luong -= 1;
      setCartItems([...cartItems]);
    }
  };

  const handleRemove = async (id) => {
    try {
      const response = await axios.delete("/cart", { data: { mau_ma_sp: id } });
      // Xử lý xóa sản phẩm khỏi giỏ hàng trong UI
      setCartItems(cartItems.filter((item) => item.Mau_ma_sp !== id));
      alert(response.data.message); // Hiển thị thông báo thành công
    } catch (error) {
      console.error("Error deleting product from cart:", error);
      alert("Xóa sản phẩm khỏi giỏ hàng thất bại.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>

      {cartItems.length > 0 ? (
        <div>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.Mau_ma_sp}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center">
                  <img
                    src={item.Url_thumbnail || "https://via.placeholder.com/80"}
                    alt={item.Ten_san_pham}
                    className="w-16 h-16 rounded-md cursor-pointer hover:opacity-80 transition"
                    onClick={() => openPopup(item)} // Mở popup khi click vào ảnh
                  />
                  <div className="ml-4">
                    <p
                      className="font-medium text-blue-500 cursor-pointer hover:underline"
                      onClick={() => openPopup(item)} // Mở popup khi click vào tên
                    >
                      {item.Ten_san_pham}
                    </p>
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <p>Giá: {item.Gia.toLocaleString()} VND</p>
                      <p>Size: {item.Kich_co}</p>
                      <p>Màu sắc: {item.Mau_sac}</p>
                    </div>
                  </div>
                </div>

                {/* Thao tác tăng/giảm/xóa */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleDecrease(item.Mau_ma_sp)}
                      className="p-2 bg-gray-200 rounded-md"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.So_luong}</span>
                    <button
                      onClick={() => handleIncrease(item.Mau_ma_sp)}
                      className="p-2 bg-gray-200 rounded-md"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.Mau_ma_sp)} // Xử lý xóa sản phẩm
                    className="text-red-500 hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gray-100 p-4 rounded-md shadow-md">
            <div className="flex justify-between mb-4">
              <p className="text-lg font-semibold">Tổng cộng:</p>
              <p className="text-lg font-bold">
                {cartItems
                  .reduce((total, item) => total + item.Gia * item.So_luong, 0)
                  .toLocaleString()}{" "}
                VND
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

      {isPopupOpen && selectedProduct && (
        <ProductDetailPopup
          setOpen={closePopup}
          productData={selectedProduct}
          updateCart={(updatedProduct) => {
            setCartItems((prev) =>
              prev.map((item) =>
                item.Mau_ma_sp === updatedProduct.Mau_ma_sp
                  ? updatedProduct
                  : item
              )
            );
          }}
        />
      )}
    </div>
  );
};

export default CartDetails;
