import React from "react";
import InsuranceRow from "./InsuranceRow";

export default function InsuranceTable({ data }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              {[
                "Mã NV",
                "Họ tên",
                "Loại chế độ",
                "Mức hưởng",
                "Ngày bắt đầu",
                "Trạng thái",
              ].map(h => (
                <th key={h} className="px-6 py-4 text-xs font-bold uppercase text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.map(emp => (
              <InsuranceRow key={emp.id} employee={emp} />
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-textMuted">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
