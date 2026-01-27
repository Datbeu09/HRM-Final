import React from "react";
import StatAS from "./StatAS";

export default function AttendanceStats({ employeeCount, loading, error }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatAS
        title="Tổng nhân sự"
        value={loading ? "Loading..." : error ? "Error" : employeeCount}
        icon="groups"
      />
      <StatAS title="Công chuẩn tháng" value="22" icon="calendar_month" />
      <StatAS title="Tổng giờ OT" value="45h" icon="av_timer" />
      <StatAS title="Cần rà soát" value="3" icon="pending_actions" danger />
    </div>
  );
}
