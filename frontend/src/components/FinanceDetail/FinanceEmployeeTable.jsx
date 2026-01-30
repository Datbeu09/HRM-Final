import React from "react";

const money = (n) => {
  if (typeof n !== "number") return n ?? "--";
  return n.toLocaleString("vi-VN");
};

export default function FinanceEmployeeTable({ rows = [], totals }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <Th>Mã NV</Th>
              <Th>Họ tên</Th>
              <Th>Lương cơ bản</Th>
              <Th>Ngày công</Th>
              <Th>Phụ cấp & Thưởng</Th>
              <Th>Khấu trừ (Thuế/BH)</Th>
              <Th>Thực nhận</Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {rows.map((r) => (
              <tr key={r.code} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{r.code}</td>
                <td className="px-6 py-4 text-sm font-bold">{r.name}</td>
                <td className="px-6 py-4 text-sm">{money(r.base)}</td>
                <td className="px-6 py-4 text-sm">{r.attendance}</td>
                <td className="px-6 py-4 text-sm">{money(r.bonus)}</td>
                <td className="px-6 py-4 text-sm text-red-500">{money(r.deduction)}</td>
                <td className="px-6 py-4 text-sm font-bold text-primary">{money(r.net)}</td>
              </tr>
            ))}

            <tr className="bg-slate-50">
              <td colSpan={2} className="px-6 py-4 text-sm font-bold text-center">
                TỔNG CỘNG
              </td>
              <td className="px-6 py-4 text-sm font-bold">{money(totals?.sumBase ?? 0)}</td>
              <td className="px-6 py-4" />
              <td className="px-6 py-4 text-sm font-bold">{money(totals?.sumBonus ?? 0)}</td>
              <td className="px-6 py-4 text-sm font-bold text-red-500">
                {money(totals?.sumDed ?? 0)}
              </td>
              <td className="px-6 py-4 text-sm font-bold text-primary">
                {money(totals?.sumNet ?? 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
      {children}
    </th>
  );
}
