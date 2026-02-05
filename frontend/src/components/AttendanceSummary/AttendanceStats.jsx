import React from "react";
import StatAS from "./StatAS";

export default function AttendanceStats({ employeeCount, loading, error }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatAS
        title="Tổng nhân sự"
        value={loading ? "Loading..." : error ? "Error" : employeeCount}
        icon="groups"
      />
      <StatAS title="Công chuẩn tháng" value="22" icon="calendar_month" />
      <StatAS title="Tổng công OT" value="45h" icon="av_timer" />
    </div>
  );
}
