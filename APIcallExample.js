// Description: Example of calling API using axios
// http://localhost:5000/sign-up-seller
const axios = require("axios");
let data = JSON.stringify({
  ten: "haiconheo",
  so_nha: "250",
  phuong_or_xa: "Tân Đông Hiệp",
  quan_or_huyen: "Dĩ AN",
  tinh_or_tp: "Bình Dương",
});

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "http://localhost:5000/sign-up-seller",
  headers: {
    "Content-Type": "application/json",
    Cookie:
      "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMTIgICAgICAiLCJpYXQiOjE3MzI3NTU2NzksImV4cCI6MTczMjg0MjA3OX0.H57UX4UEFeruiPaTkF7dkOp1mG71MMuaZLejnuopFQY",
  },
  data: data,
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });

// http://localhost:5000/add-product-category
data = JSON.stringify({
  ten_danh_muc: "",
});

// http://localhost:5000/add-product
data = JSON.stringify({
  ten_san_pham: "Áo siêu ám",
  gia: 10000,
  url_thumbnail: "url_thumbnail",
  ten_danh_muc: "xuân hè",
  mau_ma_san_phams: [
    {
      mau_sac: "Do",
      kich_co: "XXL",
      so_luong_ton_kho: 1000,
    },
  ],
  hinh_anh_san_phams: ["url1", "url2"],
});

// http://localhost:5000/seller-info
// http://localhost:5000/product-detail/:id
// http://localhost:5000/product-seller
// http://localhost:5000/best-selling-products (Hiển thị ở trang Home)
// http://localhost:5000/search-products?keyword=áo
