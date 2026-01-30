import React from "react";
import { useNavigate } from "react-router-dom";
import { formatVND, labelMonth } from "./payrollUtils";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-2">
      <span className="material-symbols-outlined text-slate-400 text-[44px]">
        inbox
      </span>
      <p className="font-semibold text-slate-700">Không có dữ liệu</p>
      <p className="text-sm text-slate-500">
        Thử đổi tháng/phòng ban hoặc tìm kiếm với từ khóa khác.
      </p>
    </div>
  );
}

export default function PayrollEmployeeTable({
  month,
  loading,
  rows,
  filtered,
  dataStatusLabel,
  dotColorClass,
}) {
  const navigate = useNavigate();

  const handleRowClick = (r) => {
    if (!r?.employeeId) return;

    navigate(
      `/accountant/payroll/${r.employeeId}?month=${month}`
    );
  };

  return (
    <section className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Danh sách nhân viên
          </h3>
          <p className="text-sm text-slate-500">
            {loading ? "..." : filtered.length} nhân viên • Tháng{" "}
            {labelMonth(month)}
          </p>
        </div>

        <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className={`w-2 h-2 rounded-full ${dotColorClass}`} />
          {dataStatusLabel}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left font-semibold">Mã NV</th>
              <th className="px-6 py-4 text-left font-semibold">Họ tên</th>
              <th className="px-6 py-4 text-right font-semibold bg-primary/5 text-primary">
                Thực lĩnh
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-slate-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-10">
                  <EmptyState />
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.employeeId || r.employeeCode}
                  onClick={() => handleRowClick(r)}
                  className="
                    cursor-pointer
                    transition
                    hover:bg-primary/5
                    active:bg-primary/10
                  "
                  title="Xem chi tiết bảng lương nhân viên"
                >
                  <td className="px-6 py-4 text-slate-500">
                    {r.employeeCode || "N/A"}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {r.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right font-extrabold text-primary bg-primary/5 tabular-nums">
                    {formatVND(r.netSalary)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
