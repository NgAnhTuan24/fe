import React from "react";

const StatCard = ({ title, value, icon: Icon, color, children }) => (
  <div className="stat-card">
    <div className={`icon-box ${color}`}>
      <Icon size={22} />
    </div>
    <div className="stat-info">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p className="title" style={{ margin: 0 }}>
          {title}
        </p>
        {children}
      </div>
      <h3 style={{ marginTop: "4px" }}>{value}</h3>
    </div>
  </div>
);

export default StatCard;
