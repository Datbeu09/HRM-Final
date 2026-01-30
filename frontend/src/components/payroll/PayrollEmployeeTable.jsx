import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatVND, labelMonth } from "./payrollUtils";
import Pagination from "../common/Pagination"; // ⚠️ sửa path đúng nơi bạn đặt Pagination

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

  // ✅ paging state
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // ✅ reset về trang 1 khi đổi filter/search/sort hoặc đổi dữ liệu
  useEffect(() => {
    setPage(1);
  }, [month, loading, rows, filtered.length]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((filtered?.length || 0) / pageSize));
  }, [filtered, pageSize]);

  // ✅ nếu page vượt totalPages (khi filter làm giảm số lượng) thì kéo về
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (filtered || []).slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const handleRowClick = (r) => {
    if (!r?.employeeId) return;
    navigate(`/accountant/payroll/${r.employeeId}?month=${month}`);
  };

  return (
    <section className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Danh sách nhân viên</h3>
          <p className="text-sm text-slate-500">
            {loading ? "..." : filtered.length} nhân viên • Tháng {labelMonth(month)}
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
              <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Mã NV</th>
              <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Họ tên</th>
              <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Phòng ban</th>
              <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Lương cơ bản</th>
              <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Ngày công</th>
              <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">
                Phụ cấp &amp; Thưởng
              </th>
              <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">
                Khấu trừ (Thuế/BH)
              </th>
              <th className="px-6 py-4 text-right font-semibold bg-primary/5 text-primary whitespace-nowrap">
                Thực nhận
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-slate-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10">
                  <EmptyState />
                </td>
              </tr>
            ) : (
              pagedRows.map((r) => (
                <tr
                  key={r.employeeId || r.employeeCode}
                  onClick={() => handleRowClick(r)}
                  className="cursor-pointer transition hover:bg-primary/5 active:bg-primary/10"
                  title="Xem chi tiết bảng lương nhân viên"
                >
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {r.employeeCode || "N/A"}
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                    {r.name || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    {r.department || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap">
                    {formatVND(r.baseSalary ?? r.basicSalary ?? 0)}
                  </td>

                  <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap">
                    {Number(r.workingDays ?? r.workDays ?? r.days ?? 0)}
                  </td>

                  <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap">
                    {formatVND(r.allowanceBonus ?? r.allowance ?? r.bonus ?? 0)}
                  </td>

                  <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap">
                    {formatVND(r.deductions ?? r.taxInsDeduction ?? 0)}
                  </td>

                  <td className="px-6 py-4 text-right font-extrabold text-primary bg-primary/5 tabular-nums whitespace-nowrap">
                    {formatVND(r.netSalary ?? 0)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      {!loading && filtered.length > 0 ? (
        <div className="px-6 pb-5">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      ) : null}
    </section>
  );
}
