import React, { useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles"; // Assuming your styles are in this folder

const ProductDetailPopup = ({ setOpen, productData }) => {
  const [count, setCount] = useState(1);

  const incrementCount = () => setCount(count + 1);
  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  return (
    <div className="fixed w-full h-screen top-0 left-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
      <div className="w-[90%] md:w-[60%] bg-white rounded-lg p-6 shadow-lg relative">
        <RxCross1
          size={24}
          className="absolute top-4 right-4 cursor-pointer"
          onClick={() => setOpen(false)}
        />
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2">
            <img
              src={productData.Url_thumbnail || "https://via.placeholder.com/300"}
              alt={productData.Ten_san_pham}
              className="w-full h-[300px] object-cover rounded-lg"
            />
          </div>
          <div className="w-full md:w-1/2 mt-4 md:mt-0 md:pl-6">
            <h1 className="text-2xl font-bold">{productData.Ten_san_pham}</h1>
            <p className="text-gray-600 mt-2">{productData.Thuong_hieu}</p>
            <p className="text-lg text-gray-900 font-semibold mt-4">{productData.Gia} VND</p>
            <p className="mt-4">{productData.Mo_ta_chi_tiet || "Thông tin chi tiết về sản phẩm."}</p>

            <div className="flex items-center mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-l"
                onClick={decrementCount}
              >
                -
              </button>
              <span className="px-4 py-2 border">{count}</span>
              <button
                className="px-4 py-2 bg-gray-300 rounded-r"
                onClick={incrementCount}
              >
                +
              </button>
            </div>

            <button
              className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={() => console.log("Thêm vào giỏ hàng")}
            >
              <FaCartPlus className="inline-block mr-2" /> Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPopup;
