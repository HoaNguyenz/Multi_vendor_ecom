import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom"; // Import navigate

const CheckoutPage = () => {
  const { cartItems } = useCart(); // Lấy danh sách sản phẩm từ giỏ hàng
  const navigate = useNavigate(); // Dùng để điều hướng
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [shippingMethod, setShippingMethod] = useState("Tiết Kiệm"); // Phương thức vận chuyển
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt"); // Phương thức thanh toán

  const calculateTotal = () => {
    const shippingFee =
      shippingMethod === "Hỏa tốc"
        ? 50000
        : shippingMethod === "Nhanh"
        ? 30000
        : 15000;
    const productTotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return { productTotal, shippingFee, finalTotal: productTotal + shippingFee };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!nameRegex.test(userDetails.name)) {
      alert("Họ và tên chỉ được chứa chữ cái và khoảng trắng.");
      return false;
    }
    if (!phoneRegex.test(userDetails.phone)) {
      alert("Số điện thoại phải là 10 chữ số.");
      return false;
    }
    if (!userDetails.address) {
      alert("Vui lòng nhập địa chỉ.");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = () => {
    if (validateForm()) {
      // Thông báo và chuyển về trang chủ
      alert(`
        Đơn hàng đã được đặt thành công!
        Họ tên: ${userDetails.name}
        Số điện thoại: ${userDetails.phone}
        Địa chỉ: ${userDetails.address}
        Phương thức vận chuyển: ${shippingMethod}
        Phương thức thanh toán: ${paymentMethod}
      `);
      navigate("/"); // Chuyển về trang chủ
    }
  };

  const { productTotal, shippingFee, finalTotal } = calculateTotal();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Trang Thanh Toán</h1>

      {/* Danh sách sản phẩm */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Sản phẩm trong giỏ hàng</h2>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center">
                <img
                  src={item.image || "https://via.placeholder.com/80"}
                  alt={item.name}
                  className="w-16 h-16 rounded-md"
                />
                <div className="ml-4">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Số lượng: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-medium">
                {(item.price * item.quantity).toLocaleString()} VND
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Thông tin người nhận */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin người nhận</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleInputChange}
            placeholder="Họ và tên"
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            name="phone"
            value={userDetails.phone}
            onChange={handleInputChange}
            placeholder="Số điện thoại"
            className="w-full p-2 border rounded-md"
          />
          <textarea
            name="address"
            value={userDetails.address}
            onChange={handleInputChange}
            placeholder="Địa chỉ giao hàng"
            className="w-full p-2 border rounded-md"
            rows="3"
          />
        </div>
      </div>

      {/* Phương thức vận chuyển */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Phương thức vận chuyển</h2>
        <div className="space-y-2">
          {["Hỏa tốc", "Nhanh", "Tiết Kiệm"].map((method) => (
            <label key={method} className="flex items-center space-x-2">
              <input
                type="radio"
                name="shippingMethod"
                value={method}
                checked={shippingMethod === method}
                onChange={(e) => setShippingMethod(e.target.value)}
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
        <div className="space-y-2">
          {["Qua ngân hàng", "Tiền mặt"].map((method) => (
            <label key={method} className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tổng cộng */}
      <div className="bg-gray-100 p-4 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
        <div className="flex justify-between mb-2">
          <p>Tổng cộng:</p>
          <p className="font-medium">{productTotal.toLocaleString()} VND</p>
        </div>
        <div className="flex justify-between mb-2">
          <p>Phí vận chuyển:</p>
          <p className="font-medium">{shippingFee.toLocaleString()} VND</p>
        </div>
        <div className="flex justify-between mb-4">
          <p>Thành tiền:</p>
          <p className="font-bold text-lg">{finalTotal.toLocaleString()} VND</p>
        </div>
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
