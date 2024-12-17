import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import axios from "../../context/configAxios.js";
import { LuPackageSearch, LuPackageCheck } from "react-icons/lu";
import { FaTruckFast } from "react-icons/fa6";
import { MdRateReview } from "react-icons/md";
import DetailsPopup from "../Order/DetailsPopup.jsx";
import ShopReviewPopup from "./Popup/ShopReviewPopup.jsx";

const ShopOrders = () => {
  const [orders, setOrders] = useState([]); // State lưu danh sách đơn hàng
  const [loading, setLoading] = useState(true); // State loading
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [openReviewPopup, setOpenReviewPopup] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);

  const dateComparator = (v1, v2) => {
    const date1 = new Date(v1); // Chuyển đổi chuỗi ngày thành đối tượng Date
    const date2 = new Date(v2); // Chuyển đổi chuỗi ngày thành đối tượng Date
    return date1 - date2; // Trả về sự khác biệt giữa 2 đối tượng Date (dùng để sắp xếp)
  };
  const handleDetailClick = (maDonHang) => {
    setSelectedOrderId(maDonHang);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  // Hàm lấy danh sách đơn hàng từ API
  const fetchOrders = async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await axios.get("/seller/orders", { params });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
      setLoading(false);
    }
  };

  // Gọi fetchOrders khi component được render lần đầu
  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleConfirmOrder = async (maDonHang) => {
    try {
      const response = await axios.put(`/confirm-order/${maDonHang}`);
      alert(response.data.message); // Hiển thị thông báo xác nhận thành công
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.Ma_don_hang === maDonHang
            ? { ...order, Trang_thai: "Đang giao hàng" }
            : order
        )
      );
    } catch (error) {
      console.error("Lỗi khi xác nhận đơn hàng:", error);
      alert("Lỗi khi xác nhận đơn hàng.");
    }
  };

  const handleConfirmDelivery = async (maDonHang) => {
    try {
      const response = await axios.put(`/confirm-delivery/${maDonHang}`);
      alert(response.data.message);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.Ma_don_hang === maDonHang
            ? { ...order, Trang_thai: "Đã giao thành công" }
            : order
        )
      );
    } catch (error) {
      console.error("Lỗi khi xác nhận giao hàng:", error);
      alert("Lỗi khi xác nhận giao hàng.");
    }
  };

  //   const handleReviewClick = async (maDonHang, maSanPham) => {
  //     try {
  //       const response = await axios.get(`review/${maSanPham}/${maDonHang}`);
  //       // Nếu có dữ liệu đánh giá, bạn có thể cập nhật vào state hoặc hiển thị trong popup
  //       setReviewData(response.data); // Cập nhật dữ liệu đánh giá nếu cần
  //       setOpenReviewPopup(true); // Mở pop-up đánh giá
  //     } catch (error) {
  //       console.error("Lỗi khi lấy thông tin đánh giá:", error);
  //     }
  //   };
  const handleReviewClick = (maDonHang) => {
    setSelectedOrderForReview(maDonHang);
    setOpenReviewPopup(true);
  };

  // Cột cho DataGrid
  const columns = [
    {
      field: "Ma_don_hang",
      headerName: "Mã đơn hàng",
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "Ten_nguoi_dung",
      headerName: "Người đặt",
      minWidth: 100,
      flex: 0.7,
      headerAlign: "center",
    },
    {
      field: "Sdt",
      headerName: "Số điện thoại",
      minWidth: 90,
      flex: 0.7,
      headerAlign: "center",
    },
    {
      field:
        statusFilter === "Đã giao thành công"
          ? "Thoi_gian_giao_thuc_te"
          : "Thoi_gian_dat_hang",
      headerName:
        statusFilter === "Đã giao thành công" ? "Đã giao lúc" : "Ngày đặt",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      sortComparator: dateComparator,
      renderCell: (params) => {
        const date = new Date(
          statusFilter === "Đã giao thành công"
            ? params.row.Thoi_gian_giao_thuc_te
            : params.row.Thoi_gian_dat_hang
        );
        return `${date.toISOString().replace("T", " ").slice(11, 19)} ${date
          .toISOString()
          .slice(0, 10)
          .split("-")
          .reverse()
          .join("/")}`;
      },
    },
    {
      field: "Trang_thai",
      headerName: "Trạng thái",
      minWidth: 100,
      flex: 0.8,
      headerAlign: "center",
    },
    {
      field: "Phi_giao_hang",
      headerName: "Phí giao hàng",
      minWidth: 80,
      flex: 0.7,
      headerAlign: "center",
      renderCell: (params) => `${params.row.Phi_giao_hang.toLocaleString()} đ`,
    },
    {
      field: "Tong_gia",
      headerName: "Tổng giá",
      minWidth: 80,
      flex: 0.7,
      headerAlign: "center",
      renderCell: (params) => `${params.row.Tong_gia.toLocaleString()} đ`,
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
      field: "update",
      headerName:
        statusFilter === "Đã giao thành công" ? "Đánh giá" : "Cập nhật", // Thay đổi tên cột dựa trên trạng thái lọc
      minWidth: 80,
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => {
        const trangThai = params.row.Trang_thai;
        if (statusFilter === "Đã giao thành công") {
          // Nếu trạng thái là "Đã giao thành công", hiển thị cột đánh giá
          return (
            <Button onClick={() => handleReviewClick(params.row.Ma_don_hang)}>
              <MdRateReview size={20} color="black"></MdRateReview>
            </Button>
          );
        } else if (trangThai === "Chờ xác nhận") {
          return (
            <Button onClick={() => handleConfirmOrder(params.row.Ma_don_hang)}>
              <FaTruckFast size={20} color="orange" />
            </Button>
          );
        } else if (trangThai === "Đang giao hàng") {
          return (
            <Button
              onClick={() => handleConfirmDelivery(params.row.Ma_don_hang)}
            >
              <LuPackageCheck size={20} color="green" />
            </Button>
          );
        } else {
          return null;
        }
      },
    },
  ];

  return (
    <div className="w-[95%] bg-white shadow h-[85vh] p-3 overflow-y-scroll no-scrollbar rounded-lg">
      <div className="w-full flex items-center justify-between font-bold text-[27px] text-center pb-2">
        <h5>Tất cả đơn hàng</h5>
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
        rows={orders.map((item) => ({
          id: item.Ma_don_hang, // DataGrid yêu cầu mỗi dòng có field `id`
          ...item,
        }))}
        columns={columns}
        pageSize={10}
        autoHeight
        loading={loading}
        disableSelectionOnClick
      />
      <DetailsPopup
        open={openPopup}
        onClose={handleClosePopup}
        maDonHang={selectedOrderId}
        trangThaiDonHang={
          orders.find((order) => order.Ma_don_hang === selectedOrderId)
            ?.Trang_thai
        }
      />
      <ShopReviewPopup
        open={openReviewPopup}
        onClose={() => setOpenReviewPopup(false)}
        maDonHang={selectedOrderForReview}
      />
    </div>
  );
};

export default ShopOrders;
