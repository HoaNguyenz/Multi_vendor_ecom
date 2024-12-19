import React, { useEffect, useState } from "react";
import { DataGrid, gridDateComparator } from "@mui/x-data-grid";
import axios from "../../context/configAxios";
import { LuPackageSearch, LuPackageX } from "react-icons/lu";
import { Button } from "@mui/material";
import { MdRateReview } from "react-icons/md";
import { BiSolidMessageRoundedX } from "react-icons/bi";
import DetailsPopup from "./DetailsPopup";
import CancelOrderPopup from "./CancelOrderPopup";
import ShopReviewPopup from "../Shop/Popup/ShopReviewPopup";
import CancelReasonPopup from "../Shop/Popup/CancelReasonPopup";

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [openCancelPopup, setOpenCancelPopup] = useState(false);
  const [selectedCancelOrderId, setSelectedCancelOrderId] = useState(null);
  const [openReviewPopup, setOpenReviewPopup] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [openCancelReasonPopup, setOpenCancelReasonPopup] = useState(false);

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

  const dateComparator = (v1, v2) => {
    const date1 = new Date(v1); // Chuyển đổi chuỗi ngày thành đối tượng Date
    const date2 = new Date(v2); // Chuyển đổi chuỗi ngày thành đối tượng Date
    return date1 - date2; // Trả về sự khác biệt giữa 2 đối tượng Date (dùng để sắp xếp)
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
      sortComparator: dateComparator,
      renderCell: (params) => {
        const date = new Date(params.row.Thoi_gian_dat_hang);
        return `${date.toISOString().replace("T", " ").slice(11, 19)} ${date
          .toISOString()
          .slice(0, 10)
          .split("-")
          .reverse()
          .join("/")}`;
      },
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
    {
      field: "status",
      headerName:
        statusFilter === "Đã giao thành công" || statusFilter === "Đã hủy"
          ? "Chi tiết"
          : "Cập nhật",
      minWidth: 50,
      flex: 0.4,
      headerAlign: "center",
      renderCell: (params) => {
        const trangThai = params.row.Trang_thai;
        if (statusFilter === "Đã giao thành công") {
          return (
            <Button onClick={() => handleReviewClick(params.row.Ma_don_hang)}>
              <MdRateReview size={20} color="black"></MdRateReview>
            </Button>
          );
        } else if (trangThai === "Chờ xác nhận") {
          return (
            <Button onClick={() => handleCancelClick(params.row.Ma_don_hang)}>
              <LuPackageX size={20} color="red" />
            </Button>
          );
        } else if (statusFilter === "Đã hủy") {
          return (
            <Button onClick={() => handleCancelReasonClick(params.row.Ma_don_hang)}>
              <BiSolidMessageRoundedX
                size={20}
                color="red"
              ></BiSolidMessageRoundedX>
            </Button>
          );
        }
      },
    },
  ];

  const handleDetailClick = (maDonHang) => {
    setSelectedOrderId(maDonHang);
    setOpenPopup(true);
  };

  const handleCancelClick = (maDonHang) => {
    setSelectedCancelOrderId(maDonHang);
    setOpenCancelPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleCloseCancelPopup = () => {
    setOpenCancelPopup(false);
  };

  const handleReviewClick = (maDonHang) => {
    setSelectedOrderForReview(maDonHang);
    setOpenReviewPopup(true);
  };

  const handleCancelReasonClick = (maDonHang) => {
    const order = orders.find((order) => order.Ma_don_hang === maDonHang);
    console.log(order);
    setCancelReason(order?.Ly_do_huy || ""); // Lấy lý do hủy từ đơn hàng
    setOpenCancelReasonPopup(true); // Mở popup
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
          Thoi_gian_dat_hang: new Date(order.Thoi_gian_dat_hang).toISOString(), // Sử dụng null nếu không có
          Ngay_du_kien_giao: new Date(
            order.Ngay_du_kien_giao
          ).toLocaleDateString("vi-VN"),
          Trang_thai: order.Trang_thai,
          Phi_giao_hang: order.Phi_giao_hang.toLocaleString(),
          Tong_gia: order.Tong_gia.toLocaleString(),
        }))}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
      />

      {/* Mở popup chi tiết đơn hàng */}
      <DetailsPopup
        open={openPopup}
        onClose={handleClosePopup}
        maDonHang={selectedOrderId}
        trangThaiDonHang={
          orders.find((order) => order.Ma_don_hang === selectedOrderId)
            ?.Trang_thai
        }
      />

      {/* Mở popup hủy đơn hàng */}
      <CancelOrderPopup
        open={openCancelPopup}
        onClose={handleCloseCancelPopup}
        maDonHang={selectedCancelOrderId}
      />

      <ShopReviewPopup
        open={openReviewPopup}
        onClose={() => setOpenReviewPopup(false)}
        maDonHang={selectedOrderForReview}
      />

      <CancelReasonPopup
        open={openCancelReasonPopup}
        onClose={() => setOpenCancelReasonPopup(false)}
        reason={cancelReason}
      />
    </div>
  );
};

export default OrderDetails;
