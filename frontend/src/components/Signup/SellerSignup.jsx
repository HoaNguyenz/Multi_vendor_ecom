import { React, useState } from "react";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "../../context/configAxios";

const SellerSignup = () => {
  const [ten, setTen] = useState("");
  const [moTa, setMoTa] = useState("");
  const [urlLogo, setUrlLogo] = useState("");
  const [soNha, setSoNha] = useState("");
  const [phuongXa, setPhuongXa] = useState("");
  const [quanHuyen, setQuanHuyen] = useState("");
  const [tinhTP, setTinhTP] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gửi yêu cầu đăng ký người bán đến backend
      const response = await axios.post("http://localhost:5000/sign-up-seller", {
        ten,
        mo_ta: moTa,
        url_logo: urlLogo,
        so_nha: soNha,
        phuong_or_xa: phuongXa,
        quan_or_huyen: quanHuyen,
        tinh_or_tp: tinhTP,
      });

      if (response.status === 201) {
        alert("Đăng ký trở thành người bán thành công!");
        navigate("/shop-dashboard"); // Chuyển hướng đến trang quản lý của người bán
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Hiển thị thông báo lỗi từ backend
        alert(error.response.data.message || "Đăng ký không thành công.");
      } else {
        alert("Lỗi kết nối. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Đăng ký trở thành người bán
        </h2>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-4 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên cửa hàng
              </label>
              <input
                type="text"
                value={ten}
                onChange={(e) => setTen(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mô tả cửa hàng
              </label>
              <textarea
                value={moTa}
                onChange={(e) => setMoTa(e.target.value)}
                rows={3}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL Logo
              </label>
              <input
                type="text"
                value={urlLogo}
                onChange={(e) => setUrlLogo(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số nhà
              </label>
              <input
                type="text"
                value={soNha}
                onChange={(e) => setSoNha(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phường/Xã
              </label>
              <input
                type="text"
                value={phuongXa}
                onChange={(e) => setPhuongXa(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quận/Huyện
              </label>
              <input
                type="text"
                value={quanHuyen}
                onChange={(e) => setQuanHuyen(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tỉnh/Thành phố
              </label>
              <input
                type="text"
                value={tinhTP}
                onChange={(e) => setTinhTP(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
              >
                Đăng ký
              </button>
            </div>

            <div className={`${styles.normalFlex} w-full`}>
              <Link to="/" className="text-blue-600 pl-2">
                Quay về trang chủ
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerSignup;
