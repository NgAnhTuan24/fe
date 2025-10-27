import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getWeeksInMonth } from "../../utils/dateUtils";

const DailySalesLineChart = ({
  data,
  year,
  month,
  week,
  onYearChange,
  onMonthChange,
  onWeekChange,
  onResetWeek,
}) => (
  <div className="chart full">
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
      }}
    >
      <h3>Số đơn hàng theo ngày</h3>
      <div style={{ display: "flex", gap: "8px" }}>
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

        <select
          value={month}
          onChange={onMonthChange}
          style={{
            padding: "4px 8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>

        <select
          value={week}
          onChange={onWeekChange}
          style={{
            padding: "4px 8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          {Array.from({ length: getWeeksInMonth(year, month) }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Tuần {i + 1}
            </option>
          ))}
        </select>

        <button
          onClick={onResetWeek}
          style={{
            padding: "4px 10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: "#f3f4f6",
            cursor: "pointer",
          }}
        >
          Tuần hiện tại
        </button>
      </div>
    </div>

    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis allowDecimals={false} tickCount={6} />
        <Tooltip
          formatter={(value) => [`${value}`, "Số đơn hàng"]}
          contentStyle={{
            backgroundColor: "rgba(255,255,255,0.95)",
            borderRadius: "6px",
            border: "1px solid #ddd",
          }}
          labelStyle={{ fontWeight: "bold" }}
        />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#16a34a"
          strokeWidth={3}
          dot={{ r: 4 }}
          name="Số đơn hàng"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default DailySalesLineChart;
