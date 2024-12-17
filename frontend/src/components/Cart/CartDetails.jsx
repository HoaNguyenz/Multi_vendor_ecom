import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../context/configAxios";
import ProductDetailPopup from "../../components/Product/ProductDetailPopup";
import { FaPlus, FaMinus } from "react-icons/fa";

const CartDetails = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]); // Dữ liệu giỏ hàng từ API
  const [selectedProduct, setSelectedProduct] = useState(null); // Sản phẩm đang được chọn
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Trạng thái của popup
  const [selectedItems, setSelectedItems] = useState([]); // Danh sách các sản phẩm được chọn
  const [selectAll, setSelectAll] = useState(false); // Trạng thái chọn tất cả

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
      item.So_luong += 1;
      setCartItems([...cartItems]);
    }
  };

  const handleDecrease = (id) => {
    const item = cartItems.find((item) => item.Mau_ma_sp === id);
    if (item && item.So_luong > 1) {
      item.So_luong -= 1;
      setCartItems([...cartItems]);
    }
  };

  const handleRemove = async (id) => {
    try {
      const response = await axios.delete("/cart", { data: { mau_ma_sp: id } });
      setCartItems(cartItems.filter((item) => item.Mau_ma_sp !== id));
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
      alert(response.data.message);
    } catch (error) {
      console.error("Error deleting product from cart:", error);
      alert("Xóa sản phẩm khỏi giỏ hàng thất bại.");
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.Mau_ma_sp));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckout = () => {
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.Mau_ma_sp)
    );

    if (selectedProducts.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }

    // Điều hướng đến trang thanh toán với các sản phẩm đã chọn
    navigate("/checkout", { state: { items: selectedProducts } });
  };

  return (
    <div className="container mx-auto my-4 p-4 bg-white rounded-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Giỏ hàng của bạn</h1>
        <button
          onClick={handleSelectAll}
          className="text-blue-500 hover:underline"
        >
          {selectAll ? "Bỏ chọn tất cả" : "Chọn tất cả"}
        </button>
      </div>

      {cartItems.length > 0 ? (
        <div className="flex gap-8">
          {/* Cart Items Section */}
          <div className="w-3/4">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.Mau_ma_sp}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.Mau_ma_sp)}
                      onChange={() => handleSelectItem(item.Mau_ma_sp)}
                      className="mr-4"
                    />
                    <img
                      src={
                        item.Url_thumbnail || "https://via.placeholder.com/80"
                      }
                      alt={item.Ten_san_pham}
                      className="w-16 h-16 rounded-md cursor-pointer hover:opacity-80 transition"
                      onClick={() => openPopup(item)}
                    />
                    <div className="ml-4">
                      <p
                        className="font-medium text-blue-500 cursor-pointer hover:underline"
                        onClick={() => openPopup(item)}
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

                  <div className="flex items-center space-x-4 rounded-md">
                    <div className="flex items-center p-1 rounded-full border-gray-300 border-[1px]">
                      <button
                        onClick={() => handleDecrease(item.Mau_ma_sp)}
                        className="p-2 rounded-full flex items-center justify-center hover:bg-gray-200"
                      >
                        <FaMinus/>
                      </button>
                      <span className="mx-3 text-lg">{item.So_luong}</span>
                      <button
                        onClick={() => handleIncrease(item.Mau_ma_sp)}
                        className="p-2 rounded-full flex items-center justify-center hover:bg-gray-200"
                      >
                        <FaPlus/>
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.Mau_ma_sp)}
                      className="text-red-500 hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Summary Section */}
          <div className="w-1/4 bg-white p-4 rounded-md shadow-md">
            <div className="flex justify-between mb-4">
              <p className="text-lg font-semibold">Tổng cộng:</p>
              <p className="text-lg font-bold">
                {cartItems
                  .filter((item) => selectedItems.includes(item.Mau_ma_sp))
                  .reduce((total, item) => total + item.Gia * item.So_luong, 0)
                  .toLocaleString()}{" "}
                VND
              </p>
            </div>
            <button
              onClick={handleCheckout}
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
