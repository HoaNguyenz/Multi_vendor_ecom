import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../context/configAxios";
import ProductCard from "./ProductCard";

const ShopOfProduct = () => {
  const { id } = useParams(); // id chính là ma_cua_hang
  const [shopData, setShopData] = useState(null); // Thông tin shop
  const [ratings, setRatings] = useState(null); // Thông tin đánh giá
  const [products, setProducts] = useState([]); // Danh sách sản phẩm
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        // Gọi API lấy thông tin cửa hàng
        const shopResponse = await axios.get(`/shop/${id}`);
        setShopData(shopResponse.data);

        // Gọi API lấy thông tin đánh giá
        const ratingsResponse = await axios.get(`/ratings/${id}`);
        setRatings(ratingsResponse.data);

        // Gọi API lấy danh sách sản phẩm
        const productsResponse = await axios.get(`/products/${id}`);
        setProducts(productsResponse.data.products || []);
      } catch (error) {
        console.error("Error fetching shop details, ratings, or products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!shopData) return <p>Không tìm thấy thông tin cửa hàng.</p>;

  return (
    <div className="container mx-auto p-5 flex gap-5 bg-white rounded-md">
      {/* Thông tin cửa hàng */}
      <div className="w-[25%] bg-white p-5 rounded-lg shadow-md">
        <div className="flex justify-center mb-5">
          <img
            src={shopData.Url_logo || "https://via.placeholder.com/150"}
            alt="Shop Avatar"
            className="w-[15vh] h-[15vh] object-cover rounded-full"
          />
        </div>
        <h3 className="text-center text-lg font-bold">{shopData.Ten || "Shop Name"}</h3>
        <div className="mt-5 space-y-3">
          <div>
            <h5 className="font-bold">Địa chỉ của shop</h5>
            <p className="text-gray-700">
              {`${shopData.So_nha}, ` || ""}
              {`${shopData.Phuong_or_Xa}, ` || ""}
              {`${shopData.Quan_or_Huyen}, ` || ""}
              {shopData.Tinh_or_TP || "N/A"}
            </p>
          </div>
          <div>
            <h5 className="font-bold">Số điện thoại</h5>
            <p className="text-gray-700">{shopData.Sdt[0] || "N/A"}</p>
          </div>
          <div>
            <h5 className="font-bold">Mô tả</h5>
            <p className="text-gray-700">{shopData.Mo_ta || "Chưa có mô tả"}</p>
          </div>
          <div>
            <h5 className="font-bold">Shop Ratings</h5>
            <p className="text-gray-700">
              {ratings ? `${ratings.averageRating}/5` : "N/A"}{" "}
              ({ratings ? `${ratings.totalRatings} lượt đánh giá` : "0 lượt đánh giá"})
            </p>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="w-[75%]">
        <h2 className="text-xl font-bold mb-5">Sản phẩm của cửa hàng</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.Ma_san_pham} product={product} />
            ))
          ) : (
            <p>Không có sản phẩm nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopOfProduct;
