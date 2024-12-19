import React, { useEffect, useState } from "react";
import axios from "../../context/configAxios"; // Thay đổi theo cấu trúc project của bạn
import styles from "../../styles/styles"; // Thay đổi theo file styles của bạn
import ProductCard from "../Product/ProductCard";
import EditShopInfo from "./Popup/EditShopInfo";

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`/seller-info`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
    axios
      .get(`/product-seller`)
      .then((res) => {
        setProducts(res.data.products || []);
        setIsProductLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsProductLoading(false);
      });
      axios
      .get(`/shop-rating`)
      .then((res) => {
        setData((prevData) => ({
          ...prevData,
          ratings: res.data.averageRating || "0",
          totalRatings: res.data.totalRatings || 0,
        }));
      })
      .catch((error) => {
        console.error("Lỗi khi lấy rating của shop:", error);
      });
  }, []);

  if (isLoading || isProductLoading) {
    return <div>Loading...</div>; // Có thể thay bằng Loader component
  }

  return (
    <div className="w-full flex">
      {/* Shop Infor */}
      <div className="w-[30%] bg-white p-5 rounded-lg shadow-md">
        <div className="flex justify-center mb-5">
          <img
            src={data.Url_logo || "https://via.placeholder.com/150"}
            alt="Shop Avatar"
            className="w-[15vh] h-[15vh] object-cover rounded-full"
          />
        </div>
        <h3 className="text-center text-lg font-bold">
          {data.Ten || "Shop Name"}
        </h3>
        <div className="mt-5 space-y-3">
          <div>
            <h5 className="font-bold">Địa chỉ của shop</h5>
            <p className="text-gray-700">
              {`${data.So_nha}, ` || ""}
              {`${data.Phuong_or_Xa}, ` || ""}
              {`${data.Quan_or_Huyen}, ` || ""}
              {data.Tinh_or_TP || "N/A"}
            </p>
          </div>
          <div>
            <h5 className="font-bold">Số điện thoại</h5>
            <p className="text-gray-700">{data.Sdt[0] || "N/A"}</p>
          </div>
          <div>
            <h5 className="font-bold">Sản phẩm có trong shop</h5>
            <p className="text-gray-700">{products.length}</p>
          </div>
          <div>
            <h5 className="font-bold">Shop Ratings</h5>
            <p className="text-gray-700">{data.ratings}/5 ({data.totalRatings} lượt đánh giá)</p>
          </div>
          <div>
            <h5 className="font-bold">Mô tả</h5>
            <p className="text-gray-700">
            <p className="text-gray-700">{data.Mo_ta}</p>
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsPopupOpen(true)}
          className={`${styles.button} w-full py-2 text-white`}
        >
          Edit Shop
        </button>
      </div>

      {/* Product List */}
      <div className="w-[70%] bg-white ml-5 p-5 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">
          Các sản phẩm hiện có trong cửa hàng
        </h2>
        {products.length === 0 ? (
          <p className="text-gray-500">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.Ma_san_pham} product={product} />
            ))}
          </div>
        )}
      </div>

      <EditShopInfo
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        shopInfo={data}
        onUpdate={(updatedData) => {
          setData(updatedData); // Cập nhật thông tin shop sau khi chỉnh sửa
          setIsPopupOpen(false); // Đóng popup sau cập nhật
        }}
      />
    </div>
  );
};

export default ShopInfo;
