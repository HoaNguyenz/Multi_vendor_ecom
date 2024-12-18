import React, { useState, useEffect } from "react";
import axios from "../../context/configAxios";
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
  const [rankingData, setRankingData] = useState([]);
  const [timeRange, setTimeRange] = useState("today"); // Giá trị mặc định: "today"
  const [chartData, setChartData] = useState([]);
  const [tasks, setTasks] = useState({
    "Chờ lấy hàng": 0,
    "Đang giao": 0,
    "Đã giao thành công": 0,
    "Bị hủy": 0,
    "Sản phẩm hết hàng": 0, // Dữ liệu giả định
  });
  const [currentData, setCurrentData] = useState({
    totalSales: 0,
    productsSold: 0,
    orders: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi tất cả API trong một lần
        const [completedOrdersResponse, salesSummaryResponse] = await Promise.all([
          axios.get("/orders-completed", { params: { timeRange } }),
          axios.get("/sales-summary", { params: { timeRange } })
        ]);
  
        // Xử lý dữ liệu từ API orders-completed
        const orders = completedOrdersResponse.data;
        const formattedData = orders.reduce((acc, order) => {
          const orderTime = new Date(order.Thoi_gian_giao_thuc_te);
          orderTime.setHours(orderTime.getHours() - 7);
          let groupKey;
  
          if (timeRange === "today" || timeRange === "last3Days") {
            const day = orderTime.getDate();
            const month = orderTime.getMonth();
            const hour = orderTime.getHours();
            groupKey = new Date(orderTime.getFullYear(), month, day, hour);
          } else {
            groupKey = orderTime.toISOString().split("T")[0];
          }
  
          if (!acc[groupKey]) {
            acc[groupKey] = { time: groupKey, count: 0, value: 0 };
          }
  
          acc[groupKey].count += 1;
          acc[groupKey].value += order.Tong_gia;
          return acc;
        }, {});
  
        const result = Object.values(formattedData)
          .sort((a, b) => a.time - b.time)
          .map((item) => ({ ...item, value: item.value / 1000000 }));
  
        setChartData(result);
  
        // Xử lý dữ liệu từ API sales-summary
        setCurrentData(salesSummaryResponse.data);
  
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
  
    fetchData();
  }, [timeRange]); // Chỉ cần timeRange làm dependency cho cả hai API

  useEffect(() => {
    const fetchTaskStatus = async () => {
      try {
        const response = await axios.get("/get-status"); // Gọi API
        const data = response.data;

        const taskCounts = {
          "Chờ xác nhận": 0,
          "Đang giao hàng": 0,
          "Đã giao thành công": 0,
          "Đã hủy": 0,
          "Sản phẩm hết hàng": 0, // Dữ liệu giả định
        };

        // Ánh xạ trạng thái từ backend sang frontend
        const statusMapping = {
          "Chờ xác nhận": "Chờ xác nhận",
          "Đang giao hàng": "Đang giao hàng",
          "Đã giao thành công": "Đã giao thành công",
          "Đã hủy": "Đã hủy",
        };

        // Cập nhật số lượng cho từng trạng thái
        data.forEach((order) => {
          const frontendStatus = statusMapping[order.Trang_thai];
          if (frontendStatus && taskCounts[frontendStatus] !== undefined) {
            taskCounts[frontendStatus]++;
          }
        });

        setTasks(taskCounts);
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái đơn hàng:", error);
      }
    };

    fetchTaskStatus();
  }, []);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const response = await axios.get(`/product-rank?filter=${filter}`);
        setRankingData(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
      }
    };

    fetchRankingData();
  }, [filter]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Tasks Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="text-lg font-semibold mb-4">Các việc cần làm</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(tasks).map(([title, value], index) => (
            <div
              key={index}
              className={`p-4 rounded-lg text-center ${
                value > 0
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <div className="text-2xl font-bold">{value}</div>
              <div>{title}</div>
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
            <option value="today">Hôm nay</option>
            <option value="last3Days">Trong 3 ngày</option>
            <option value="lastWeek">Trong 1 tuần</option>
            <option value="last15Days">Trong nửa tháng</option>
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-lg text-center">
            <div className="text-xl font-bold">
              {currentData.totalSales ? currentData.totalSales.toLocaleString("vi-VN") : 0} Đ
            </div>
            <div>Tổng doanh số</div>
          </div>
          <div className="p-4 bg-blue-100 text-blue-600 rounded-lg text-center">
            <div className="text-xl font-bold">{currentData.productsSold ? currentData.productsSold : 0}</div>
            <div>Lượng sản phẩm bán ra</div>
          </div>
          <div className="p-4 bg-purple-100 text-purple-600 rounded-lg text-center">
            <div className="text-xl font-bold">{currentData.orders ? currentData.orders : 0}</div>
            <div>Số đơn hàng đã bán</div>
          </div>
        </div>
      </div>
      {/* Tổng quan doanh số */}

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="text-lg font-semibold mb-4">Tổng quan doanh số</div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickFormatter={(time) => {
                // Định dạng thời gian cho trục X (dd-mm hh:00)
                const date = new Date(time);
                const formattedDate = date.toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                }); // dd/mm
                const formattedHour = date
                  .getHours()
                  .toString()
                  .padStart(2, "0"); // Giờ (2 chữ số)
                return `${formattedDate} ${formattedHour}:00`; // Hiển thị như dd/mm hh:00
              }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Dòng số lượng đơn hàng */}
            <Line
              type="monotone"
              dataKey="count"
              stroke="#82ca9d"
              name="Số lượng đơn hàng"
            />

            {/* Dòng tổng giá trị đơn hàng */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              name="Tổng giá trị (Triệu Đồng)"
            />
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
            {rankingData.map((product, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 border text-center">{index + 1}</td>
                <td className="px-4 py-2 border">{product.Ten_san_pham}</td>
                <td className="px-4 py-2 border text-center">
                  {product.So_luong_ban}
                </td>
                <td className="px-4 py-2 border text-right">
                  {product.Doanh_thu.toLocaleString("vi-VN")} Đồng
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
