import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueByMonthChart = ({ data, year, onYearChange }) => (
  <div className="chart large">
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h3>Doanh thu theo tháng</h3>
      <select
        value={year}
        onChange={onYearChange}
        style={{
          padding: "4px 8px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      >
        {Array.from({ length: 5 }, (_, i) => {
          const y = new Date().getFullYear() - i;
          return (
            <option key={y} value={y}>
              {y}
            </option>
          );
        })}
      </select>
    </div>

    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
        <Tooltip
          formatter={(value) => `${value.toLocaleString("vi-VN")} VND`}
          labelFormatter={(label) => `Tháng ${label.replace("T", "")}`}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#rev)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default RevenueByMonthChart;
