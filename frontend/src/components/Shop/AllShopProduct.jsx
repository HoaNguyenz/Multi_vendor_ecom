import {React, useState} from "react";
import { DataGrid } from "@mui/x-data-grid";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Button } from "@mui/material";
import AddProductPopup from "../Shop/Popup/AddProductPopup.jsx"

const AllShopProduct = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

  const columns = [
    {
      field: "id",
      headerName: "Mã sản phẩm",
      minWidth: 150,
      flex: 0.8,
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Tên sản phẩm",
      minWidth: 130,
      flex: 1.2,
      headerAlign: "center",
    },
    {
      field: "category",
      headerName: "Phân loại",
      minWidth: 70,
      flex: 0.7,
      headerAlign: "center",
    },
    {
      field: "stock",
      headerName: "Tồn kho",
      type: "number",
      minWidth: 80,
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: "Đơn giá",
      minWidth: 120,
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "sold",
      headerName: "Đã bán",
      type: "number",
      minWidth: 80,
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "delete",
      headerName: "Xoá",
      minWidth: 50,
      flex: 0.4,
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button>
              <RiDeleteBin6Line size={20}></RiDeleteBin6Line>
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div className="w-[95%] bg-white shadow h-[85vh] rouded-[4px] p-3 overflow-y-scroll no-scrollbar">
      <div className="w-full flex items-center justify-between font-bold text-[27px] text-center pb-2">
        <h5>Tất cả sản phẩm</h5>
        <Button variant="outlined" onClick={openPopup}>
          Thêm sản phẩm
        </Button>
      </div>
      <DataGrid columns={columns} pageSize={10}></DataGrid>
      {isPopupOpen && <AddProductPopup onClose={closePopup} />}
    </div>
  );
};

export default AllShopProduct;
