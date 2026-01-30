// src/components/AttendanceSummary/AttendanceTable.jsx
import React from "react";
import RowAS from "./RowAS";

export default function AttendanceTable({ attendanceData, loading, error }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-[#F8FAFC] border-b">
          <tr>
            <th className="px-6 py-4 text-left">Nhân viên</th>
            <th className="px-6 py-4 text-center">Công chuẩn</th>
            <th className="px-6 py-4 text-center">Thực tế</th>
            <th className="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>

        {/* ✅ min-height để bảng không co/duỗi khi ít dòng */}
        <tbody className="min-h-[360px] align-top">
          {loading ? (
            <tr className="h-14">
              <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                Đang tải...
              </td>
            </tr>
          ) : error ? (
            <tr className="h-14">
              <td colSpan={4} className="px-6 py-8 text-center text-red-500">
                {error || "Lỗi tải dữ liệu"}
              </td>
            </tr>
          ) : !attendanceData || attendanceData.length === 0 ? (
            <tr className="h-14">
              <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            attendanceData.map((employee) => (
              <RowAS
                key={employee.id}
                id={employee.id}          // ✅ QUAN TRỌNG
                name={employee.name}
                code={employee.code}
                standard={employee.standard}
                actual={employee.actual}
              />
            ))

          )}
        </tbody>
      </table>
    </div>
  );
}
