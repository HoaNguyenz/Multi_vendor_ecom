import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "../../context/configAxios";
import { LuPackageSearch } from "react-icons/lu";
import { Button } from "@mui/material";
import DetailsPopup from './DetailsPopup'; // Import DetailsPopup

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const params = statusFilter ? { trang_thai: statusFilter } : {};
      const response = await axios.get("/order", { params });
      setOrders(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin đơn hàng:", error);
    }
  };

  const columns = [
    {
      field: "Ma_don_hang",
      headerName: "Mã đơn hàng",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "Thoi_gian_dat_hang",
      headerName: "Thời gian đặt",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "Ngay_du_kien_giao",
      headerName: "Ngày dự kiến giao",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "Trang_thai",
      headerName: "Trạng thái",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "Phi_giao_hang",
      headerName: "Phí giao hàng",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "Tong_gia",
      headerName: "Tổng giá",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "detail",
      headerName: "Chi tiết",
      minWidth: 50,
      flex: 0.4,
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDetailClick(params.row.Ma_don_hang)}>
          <LuPackageSearch size={20} />
        </Button>
      ),
    },
  ];

  const handleDetailClick = (maDonHang) => {
    setSelectedOrderId(maDonHang);
    setOpenPopup(true); // Mở popup chi tiết
  };

  const handleClosePopup = () => {
    setOpenPopup(false); // Đóng popup
  };

  return (
    <div className="w-[95%] bg-white shadow h-[85vh] p-3 overflow-y-scroll no-scrollbar rounded-lg">
      <div className="w-full flex items-center justify-between font-bold text-center pb-2">
        <h5 className="text-[25px]">Thông tin đơn hàng</h5>
        <div>
          <select
            className="p-2 border rounded-md text-[15px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="Chờ xác nhận">Chờ xác nhận</option>
            <option value="Đang giao hàng">Đang giao hàng</option>
            <option value="Đã giao thành công">Đã giao thành công</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
      </div>
      <DataGrid
        rows={orders.map((order) => ({
          id: order.Ma_don_hang,
          Ma_don_hang: order.Ma_don_hang,
          Thoi_gian_dat_hang:
            new Date(order.Thoi_gian_dat_hang)
              .toISOString()
              .replace("T", " ")
              .slice(11, 19) +
            " " +
            new Date(order.Thoi_gian_dat_hang)
              .toISOString()
              .slice(0, 10)
              .split("-")
              .reverse()
              .join("/"),
          Ngay_du_kien_giao: new Date(order.Ngay_du_kien_giao).toLocaleDateString("vi-VN"),
          Trang_thai: order.Trang_thai,
          Phi_giao_hang: order.Phi_giao_hang.toLocaleString(),
          Tong_gia: order.Tong_gia.toLocaleString(),
        }))}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
        sortModel={[
          {
            field: "Thoi_gian_dat_hang",
            sort: "desc",
          },
        ]}
      />

      {/* Mở popup chi tiết đơn hàng */}
      <DetailsPopup
        open={openPopup}
        onClose={handleClosePopup}
        maDonHang={selectedOrderId}
      />
    </div>
  );
};

export default OrderDetails;

