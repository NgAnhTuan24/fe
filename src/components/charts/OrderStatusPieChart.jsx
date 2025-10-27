import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const OrderStatusPieChart = ({
  data,
  year,
  month,
  onYearChange,
  onMonthChange,
}) => (
  <div className="chart small">
    <h3>Trạng thái đơn hàng</h3>
    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
      <select value={year} onChange={onYearChange}>
        {Array.from({ length: 5 }, (_, i) => {
          const y = new Date().getFullYear() - i;
          return (
            <option key={y} value={y}>
              {y}
            </option>
          );
        })}
      </select>

      <select value={month} onChange={onMonthChange}>
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            Tháng {i + 1}
          </option>
        ))}
      </select>
    </div>

    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={85}
          dataKey="count"
          nameKey="status"
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => [
            `${value} đơn hàng`,
            props.payload.status,
          ]}
        />
      </PieChart>
    </ResponsiveContainer>

    <div className="legend">
      {data.map((item, index) => (
        <div key={index} className="legend-item">
          <span
            style={{
              backgroundColor: item.color,
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              marginRight: "6px",
            }}
          ></span>
          <span style={{ flex: 1 }}>{item.status}</span>
          <span style={{ color: "#555" }}>{item.count}</span>
        </div>
      ))}
    </div>
  </div>
);

export default OrderStatusPieChart;
