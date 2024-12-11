import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [filter, setFilter] = useState("revenue");
  const [timeRange, setTimeRange] = useState("today"); // Giá trị mặc định: "today"

  // Dữ liệu giả lập theo thời gian
  const salesData = {
    today: { totalSales: 3678000, productsSold: 24, orders: 20 },
    yesterday: { totalSales: 2500000, productsSold: 18, orders: 15 },
    lastWeek: { totalSales: 15000000, productsSold: 120, orders: 95 },
    last15Days: { totalSales: 30000000, productsSold: 240, orders: 180 },
  };

  // Lấy dữ liệu tương ứng với khoảng thời gian được chọn
  const currentData = salesData[timeRange];

  const data = [
    { time: "6:00", doanhSo: 500, luongBanRa: 300 },
    { time: "9:00", doanhSo: 1200, luongBanRa: 700 },
    { time: "12:00", doanhSo: 1700, luongBanRa: 1200 },
    { time: "15:00", doanhSo: 2000, luongBanRa: 1800 },
    { time: "18:00", doanhSo: 2500, luongBanRa: 2200 },
  ];

  // Dữ liệu bảng thống kê
  const productData = [
    {
      rank: 1,
      name: "Áo thun Basic Unisex Cotton",
      quantity: 50,
      revenue: 598000,
    },
    {
      rank: 2,
      name: "Quần thun nam",
      quantity: 30,
      revenue: 149000,
    },
    {
      rank: 3,
      name: "Áo hoodie Unisex",
      quantity: 20,
      revenue: 800000,
    },
  ];

  const sortedData = [...productData].sort((a, b) => {
    if (filter === "revenue") {
      return b.revenue - a.revenue; // Lọc theo doanh thu giảm dần
    } else {
      return b.quantity - a.quantity; // Lọc theo số lượng bán giảm dần
    }
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Tasks Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="text-lg font-semibold mb-4">Các việc cần làm</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: "Chờ lấy hàng", value: 1 },
            { title: "Đang giao", value: 1 },
            { title: "Đã giao thành công", value: 1 },
            { title: "Bị hủy", value: 1 },
            { title: "Sản phẩm hết hàng", value: 0 },
          ].map((task, index) => (
            <div
              key={index}
              className="bg-blue-100 text-blue-600 p-4 rounded-lg text-center"
            >
              <div className="text-2xl font-bold">{task.value}</div>
              <div>{task.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {/* Header và Dropdown */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">Doanh số bán hàng</div>
          <select
            className="border px-4 py-2 rounded-lg"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="today">Từ hôm qua đến hôm nay</option>
            <option value="yesterday">Hôm qua</option>
            <option value="lastWeek">1 tuần trước</option>
            <option value="last15Days">15 ngày trước</option>
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-lg text-center">
            <div className="text-xl font-bold">
              {currentData.totalSales.toLocaleString("vi-VN")} Đ
            </div>
            <div>Tổng doanh số</div>
          </div>
          <div className="p-4 bg-blue-100 text-blue-600 rounded-lg text-center">
            <div className="text-xl font-bold">{currentData.productsSold}</div>
            <div>Lượng sản phẩm bán ra</div>
          </div>
          <div className="p-4 bg-purple-100 text-purple-600 rounded-lg text-center">
            <div className="text-xl font-bold">{currentData.orders}</div>
            <div>Số đơn hàng đã bán</div>
          </div>
        </div>
      </div>
      {/* Tổng quan doanh số */}

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="text-lg font-semibold mb-4">Tổng quan doanh số</div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="doanhSo"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="luongBanRa" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Thống kê thứ hạng sản phẩm */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {/* Dropdown và tiêu đề */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">Thứ hạng sản phẩm</div>
          <select
            className="border px-4 py-2 rounded-lg"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="revenue">Theo doanh thu</option>
            <option value="quantity">Theo số lượng</option>
          </select>
        </div>
        {/* Bảng thống kê */}
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Thứ hạng</th>
              <th className="px-4 py-2 border">Tên sản phẩm</th>
              <th className="px-4 py-2 border">Số lượng</th>
              <th className="px-4 py-2 border">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((product, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 border text-center">{index + 1}</td>
                <td className="px-4 py-2 border">{product.name}</td>
                <td className="px-4 py-2 border text-center">
                  {product.quantity}
                </td>
                <td className="px-4 py-2 border text-right">
                  {product.revenue.toLocaleString("vi-VN")} Đồng
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
