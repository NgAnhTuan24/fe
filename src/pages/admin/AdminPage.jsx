import React, { useEffect, useState } from "react";
import { DollarSign, Package, Users, Heart } from "lucide-react";
import { getCats } from "../../services/api/CatApi";
import { getUsers } from "../../services/api/UserApi";
import { getOrders } from "../../services/api/OrderApi";
import StatCard from "../../components/StatCard";
import RevenueByMonthChart from "../../components/charts/RevenueByMonthChart";
import OrderStatusPieChart from "../../components/charts/OrderStatusPieChart";
import DailySalesLineChart from "../../components/charts/DailySalesLineChart";
import {
  isSameDay,
  isSameMonth,
  isSameYear,
  translateStatus,
} from "../../utils/dashboardUtils";
import { getWeekRange, getCurrentWeekOfMonth } from "../../utils/dateUtils";
import "../../styles/admin/AdminPage.css";

const AdminDashboard = () => {
  const [cats, setCats] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenueFilter, setRevenueFilter] = useState("today");
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [statusMonth, setStatusMonth] = useState(today.getMonth() + 1);
  const [statusYear, setStatusYear] = useState(today.getFullYear());
  const [selectedYear2, setSelectedYear2] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(
    getCurrentWeekOfMonth(today.getFullYear(), today.getMonth() + 1)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, userRes, orderRes] = await Promise.all([
          getCats(),
          getUsers(),
          getOrders(),
        ]);
        setCats(catRes.data || []);
        setUsers(userRes);
        setOrders(orderRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const filteredOrders = orders.filter(
    (o) => o.status?.toLowerCase() === "completed"
  );
  const totalRevenue = filteredOrders
    .filter((o) => {
      if (revenueFilter === "today") return isSameDay(o.orderDate);
      if (revenueFilter === "month") return isSameMonth(o.orderDate);
      if (revenueFilter === "year") return isSameYear(o.orderDate);
      return true;
    })
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const totalCats = cats.length;
  const totalCustomers = users.length;
  const totalOrders = orders.length;

  const revenueByMonth = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthlyRevenue = filteredOrders
      .filter((o) => {
        const d = new Date(o.orderDate);
        return (
          d.getMonth() + 1 === month && d.getFullYear() === Number(selectedYear)
        );
      })
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return { month: `T${month}`, revenue: monthlyRevenue };
  });

  const filteredStatusOrders = orders.filter((o) => {
    const d = new Date(o.orderDate);
    return d.getFullYear() === statusYear && d.getMonth() + 1 === statusMonth;
  });

  const orderStatusCount = filteredStatusOrders.reduce((acc, o) => {
    const status = o.status?.toLowerCase() || "khác";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const orderStatusOrder = [
    "pending",
    "confirmed",
    "shipping",
    "completed",
    "cancelled",
  ];
  const orderStatusData = orderStatusOrder
    .filter((k) => orderStatusCount[k])
    .map((k) => ({
      status: translateStatus(k),
      count: orderStatusCount[k],
      color:
        k === "pending"
          ? "#f59e0b"
          : k === "confirmed"
          ? "#3b82f6"
          : k === "shipping"
          ? "#8b5cf6"
          : k === "completed"
          ? "#10b981"
          : "#ef4444",
    }));

  const { startOfWeek, endOfWeek } = getWeekRange(
    selectedYear2,
    selectedMonth,
    selectedWeek
  );
  const dailySalesData = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    const dayOrders = filteredOrders.filter((o) => {
      const d = new Date(o.orderDate);
      return (
        d >= startOfWeek &&
        d <= endOfWeek &&
        d.getFullYear() === day.getFullYear() &&
        d.getMonth() === day.getMonth() &&
        d.getDate() === day.getDate()
      );
    });
    const formattedDate = `${day.getDate()}/${day.getMonth() + 1}`;
    const weekdays = [
      "CN",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    const dayLabel = `${weekdays[day.getDay()]} (${formattedDate})`;
    return {
      day: dayLabel,
      sales: dayOrders.length,
      revenue: dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    };
  });

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p className="subtitle">Thống kê tổng quan cửa hàng mèo</p>
      <div className="stat-grid">
        <StatCard
          title="Doanh thu"
          value={`${totalRevenue.toLocaleString("vi-VN")} VND`}
          icon={DollarSign}
          color="green"
        >
          <select
            value={revenueFilter}
            onChange={(e) => setRevenueFilter(e.target.value)}
            style={{
              marginLeft: "8px",
              padding: "2px 6px",
              fontSize: "0.9rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="today">Hôm nay</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
        </StatCard>
        <StatCard
          title="Tổng mèo"
          value={totalCats}
          icon={Heart}
          color="pink"
        />
        <StatCard
          title="Đơn hàng"
          value={totalOrders}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Khách hàng"
          value={totalCustomers}
          icon={Users}
          color="purple"
        />
      </div>

      <div className="charts">
        <RevenueByMonthChart
          data={revenueByMonth}
          year={selectedYear}
          onYearChange={(e) => setSelectedYear(Number(e.target.value))}
        />
        <OrderStatusPieChart
          data={orderStatusData}
          year={statusYear}
          month={statusMonth}
          onYearChange={(e) => setStatusYear(Number(e.target.value))}
          onMonthChange={(e) => setStatusMonth(Number(e.target.value))}
        />
      </div>

      <div className="charts">
        <DailySalesLineChart
          data={dailySalesData}
          year={selectedYear2}
          month={selectedMonth}
          week={selectedWeek}
          onYearChange={(e) => setSelectedYear2(Number(e.target.value))}
          onMonthChange={(e) => setSelectedMonth(Number(e.target.value))}
          onWeekChange={(e) => setSelectedWeek(Number(e.target.value))}
          onResetWeek={() => {
            const now = new Date();
            setSelectedYear2(now.getFullYear());
            setSelectedMonth(now.getMonth() + 1);
            setSelectedWeek(
              getCurrentWeekOfMonth(now.getFullYear(), now.getMonth() + 1)
            );
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
