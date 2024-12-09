import { React, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { Button } from "@mui/material";
import AddProductPopup from "../Shop/Popup/AddProductPopup.jsx";
import axios from "../../context/configAxios.js";
import EditProductPopup from "./Popup/EditProductPopup.jsx";

const AllShopProduct = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [products, setProducts] = useState([]); // State lưu danh sách sản phẩm
  const [loading, setLoading] = useState(true); // State để hiển thị loading
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Lưu sản phẩm đang chỉnh sửa

  const openEditPopup = (product) => {
    setEditingProduct(product);
    setIsEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setEditingProduct(null);
    setIsEditPopupOpen(false);
  };

  // Hàm mở/đóng popup thêm sản phẩm
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  // Hàm lấy danh sách sản phẩm từ API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/product-seller");
      setProducts(response.data); // Lưu danh sách sản phẩm vào state
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      setLoading(false);
    }
  };

  // Gọi fetchProducts khi component được render lần đầu
  useEffect(() => {
    fetchProducts();
  }, []);
  const columns = [
    {
      field: "Ma_san_pham",
      headerName: "Mã sản phẩm",
      minWidth: 80,
      flex: 0.8,
      headerAlign: "center",
    },
    {
      field: "Ten_san_pham",
      headerName: "Tên sản phẩm",
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "Ten_danh_muc",
      headerName: "Phân loại",
      minWidth: 70,
      flex: 0.7,
      headerAlign: "center",
    },
    {
      field: "Ton_kho",
      headerName: "Tồn kho",
      type: "number",
      minWidth: 80,
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "Gia",
      headerName: "Đơn giá",
      minWidth: 120,
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "SL_da_ban",
      headerName: "Đã bán",
      type: "number",
      minWidth: 80,
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "Ngay_tao",
      headerName: "Ngày tạo",
      minWidth: 80,
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "edit",
      headerName: "Sửa",
      minWidth: 50,
      flex: 0.4,
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => openEditPopup(params.row)}>
          <RiEdit2Line size={20} />
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Xoá",
      minWidth: 50,
      flex: 0.4,
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.row.Ma_san_pham)}>
          <RiDeleteBin6Line size={20} />
        </Button>
      ),
    },
  ];

  // Hàm xử lý xóa sản phẩm
  const handleDelete = (productId) => {
    console.log("Xóa sản phẩm có mã:", productId);
    // Thực hiện gọi API xóa sản phẩm tại đây
  };

  return (
    <div className="w-[95%] bg-white shadow h-[85vh] rouded-[4px] p-3 overflow-y-scroll no-scrollbar">
      <div className="w-full flex items-center justify-between font-bold text-[27px] text-center pb-2">
        <h5>Tất cả sản phẩm</h5>
        <Button variant="outlined" onClick={openPopup}>
          Thêm sản phẩm
        </Button>
      </div>
      <DataGrid
        rows={products.map((item) => ({
          id: item.Ma_san_pham, // DataGrid yêu cầu mỗi dòng có field `id`
          ...item,
        }))}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
      />
      {isPopupOpen && <AddProductPopup onClose={closePopup} />}
      {isEditPopupOpen && editingProduct && (
        <EditProductPopup
          product={editingProduct}
          onClose={closeEditPopup}
          onUpdate={(updatedProduct) => {
            setProducts((prev) =>
              prev.map((item) =>
                item.Ma_san_pham === updatedProduct.Ma_san_pham
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

export default AllShopProduct;
