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
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center">Đang tải...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="4" className="text-center">Lỗi tải dữ liệu</td>
            </tr>
          ) : (
            attendanceData.map((employee) => (
              <RowAS
                key={employee.id}
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
