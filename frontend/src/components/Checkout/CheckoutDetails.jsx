import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "../../context/configAxios";
import AddAddressPopup from "../Profile/Popup/AddAddressPopup";

const CheckoutDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cartItems = location.state?.items || [];
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState("Hỏa tốc"); // Giá trị mặc định
  const [shippingFee, setShippingFee] = useState(45000); // Giá trị mặc định cho Hỏa tốc
  const [isAddAddressPopupOpen, setIsAddAddressPopupOpen] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  console.log(cartItems);
  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const addressResponse = await axios.get(`/address`);
      setAddresses(addressResponse.data);
      if (addressResponse.data.length > 0 && isAddingNewAddress) {
        setSelectedAddress(
          addressResponse.data[addressResponse.data.length - 1].ID
        );
        setIsAddingNewAddress(false);
      } else {
        setSelectedAddress(addressResponse.data[0].ID);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const shippingMethods = [
    { name: "Hỏa tốc", price: 45000 },
    { name: "Nhanh", price: 30000 },
    { name: "Tiết Kiệm", price: 15000 },
  ];
  const handleShippingMethodChange = (method) => {
    setSelectedShippingMethod(method);
    const selectedMethod = shippingMethods.find((m) => m.name === method);
    setShippingFee(selectedMethod?.price || 0); // Cập nhật phí vận chuyển tương ứng
  };

  const productTotal = cartItems.reduce((total, item) => {
    return total + item.Gia * item.So_luong;
  }, 0);

  const uniqueStores = [...new Set(cartItems.map((item) => item.Ma_cua_hang))];

  const totalShippingFee = uniqueStores.length * shippingFee;

  const finalTotal = productTotal + totalShippingFee;

  const orderData = {
    dia_chi_giao_hang: selectedAddress,
    phi_giao_hang: shippingFee,
    chi_tiet_don_hang: cartItems.map((item) => ({
      mau_ma_sp: item.Mau_ma_sp, // Mã sản phẩm
      so_luong: item.So_luong, // Số lượng sản phẩm
      ma_cua_hang: item.Ma_cua_hang, // Mã cửa hàng của sản phẩm
      gia: item.Gia,
    })),
  };
  console.log(orderData);
  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        dia_chi_giao_hang: selectedAddress,
        phi_giao_hang: shippingFee,
        chi_tiet_don_hang: cartItems.map((item) => ({
          mau_ma_sp: item.Mau_ma_sp, // Mã sản phẩm
          so_luong: item.So_luong, // Số lượng sản phẩm
          ma_cua_hang: item.Ma_cua_hang, // Mã cửa hàng của sản phẩm
          gia: item.Gia,
        })),
      };

      // Gửi yêu cầu tạo đơn hàng
      const response = await axios.post("/order", orderData);

      if (response.status === 200) {
        // Xóa sản phẩm khỏi giỏ hàng
        for (const item of cartItems) {
            await axios.delete("/cart", { data: { mau_ma_sp: item.Mau_ma_sp } });
          }
        navigate("/");
      }
    } catch (error) {
      console.error("Đặt hàng thất bại:", error);
      // Xử lý lỗi, có thể hiển thị thông báo lỗi cho người dùng
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Trang Thanh Toán</h1>
        <p className="text-center text-gray-500">
          Không có sản phẩm để thanh toán.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Thanh Toán</h1>

      {/* Danh sách sản phẩm */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Sản phẩm</h2>
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
                  className="w-16 h-16 rounded-md"
                />
                <div className="ml-4">
                  <p className="font-medium">{item.Ten_san_pham}</p>
                  <p className="text-sm text-gray-500">
                    Số lượng: {item.So_luong}
                  </p>
                </div>
              </div>
              <p className="font-medium">
                {(item.Gia * item.So_luong).toLocaleString()} VND
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Thông tin người nhận */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin đặt hàng</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={user.username}
            className="w-full p-2 border rounded-md"
            readOnly
          />
          <input
            type="text"
            name="phone"
            value={user.sdt}
            className="w-full p-2 border rounded-md"
            readOnly
          />
          <div className="flex items-center space-x-2">
            <select
              className="w-full p-2 border rounded-md"
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
            >
              {addresses.map((address) => (
                <option key={address.ID} value={address.ID}>
                  {`${address.So_nha}, ${address.Phuong_or_Xa}, ${address.Quan_or_Huyen}, ${address.Tinh_or_TP}`}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setIsAddAddressPopupOpen(true);
                setIsAddingNewAddress(true);
              }}
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Nhập địa chỉ mới
            </button>
          </div>
        </div>
      </div>

      {/* Phương thức vận chuyển */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Phương thức vận chuyển</h2>
        <div className="space-y-2">
          {shippingMethods.map((method) => (
            <label key={method.name} className="flex items-center space-x-2">
              <input
                type="radio"
                name="shippingMethod"
                value={method.name}
                checked={selectedShippingMethod === method.name}
                onChange={() => handleShippingMethodChange(method.name)}
              />
              <span>
                {method.name} - {method.price.toLocaleString()} VND
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Phương thức thanh toán */}
      {/* <div className="mb-6">
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
      </div> */}

      {/* Tổng cộng */}
      <div className="bg-gray-100 p-4 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
        <div className="flex justify-between mb-2">
          <p>Tổng cộng:</p>
          <p className="font-medium">{productTotal.toLocaleString()} VND</p>
        </div>
        <div className="flex justify-between mb-2">
          <p>Phí vận chuyển:</p>
          <p className="font-medium">{totalShippingFee.toLocaleString()} VND</p>
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

      <AddAddressPopup
        isOpen={isAddAddressPopupOpen}
        onClose={() => setIsAddAddressPopupOpen(false)}
        onAdd={fetchAddresses}
      />
    </div>
  );
};

export default CheckoutDetails;
