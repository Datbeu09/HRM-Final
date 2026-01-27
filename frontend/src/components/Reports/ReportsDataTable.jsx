// components/Reports/ReportsDataTable.jsx
import React from "react";

export default function ReportsDataTable({ employees }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="p-4 text-left">Mã NV</th>
            <th className="p-4 text-left">Họ và tên</th>
            <th className="p-4 text-left">Phòng ban</th>
            <th className="p-4 text-left">Chức danh</th>
            <th className="p-4 text-left">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr
              key={emp.id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="p-4 font-medium">{emp.employeeCode}</td>
              <td className="p-4 font-semibold ">{emp.name}</td>
              <td className="p-4">{emp.department}</td>
              <td className="p-4">{emp.position}</td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
                    ${emp.contractType === "Biên chế"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {emp.contractType}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
