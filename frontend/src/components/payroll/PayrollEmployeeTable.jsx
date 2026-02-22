import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatVND, labelMonth } from "./payrollUtils";
import Pagination from "../common/Pagination";

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

function normalizeStatusLabel(status) {
  const s = String(status || "").trim().toLowerCase();
  if (s === "đã duyệt") return "Đã duyệt";
  if (s === "chưa duyệt") return "Chưa duyệt";
  return "Chưa duyệt";
}

function statusBadge(status) {
  const t = normalizeStatusLabel(status);
  const approved = t === "Đã duyệt";
  return {
    text: t,
    cls: approved
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-amber-100 text-amber-700 border-amber-200",
  };
}

function getDepartmentName(departments, departmentId) {
  if (!departmentId) return "N/A";
  const dep = (departments || []).find((d) => String(d?.id) === String(departmentId));
  return dep?.departmentName || "N/A";
}

export default function PayrollEmployeeTable({
  month,
  loading,
  rows,
  filtered,
  departmentId,
  departments = [],
  dataStatusLabel,
  dotColorClass,
}) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const finalRows = useMemo(() => {
    if (!departmentId) return filtered || [];
    return (filtered || []).filter((r) => {
      const rowDepId = r?.departmentId ?? r?.raw?.departmentId ?? null;
      return String(rowDepId) === String(departmentId);
    });
  }, [filtered, departmentId]);

  useEffect(() => {
    setPage(1);
  }, [month, loading, rows, finalRows.length, departmentId]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((finalRows?.length || 0) / pageSize));
  }, [finalRows, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (finalRows || []).slice(start, start + pageSize);
  }, [finalRows, page, pageSize]);

  const selectedDeptName = useMemo(() => {
    return departmentId ? getDepartmentName(departments, departmentId) : "";
  }, [departments, departmentId]);

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
            {loading ? "..." : finalRows.length} nhân viên • Tháng {labelMonth(month)}
            {departmentId ? ` • ${selectedDeptName}` : ""}
          </p>
        </div>

        <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className={`w-2 h-2 rounded-full ${dotColorClass}`} />
          {dataStatusLabel}
        </span>
      </div>

      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Mã NV</th>
              <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Họ tên</th>
              <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Phòng ban</th>
              <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Lương cơ bản</th>
              <th className="px-6 py-4 text-right font-semibold whitespace-nowrap">Ngày công</th>
              <th className="px-6 py-4 text-right font-semibold bg-primary/5 text-primary whitespace-nowrap">
                Thực nhận
              </th>
              <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Trạng thái</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-6 py-10 text-slate-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : finalRows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-10">
                  <EmptyState />
                </td>
              </tr>
            ) : (
              pagedRows.map((r) => {
                const rowDepId = r?.departmentId ?? r?.raw?.departmentId ?? null;

                const departmentName =
                  r?.departmentName ||
                  r?.raw?.departmentName ||
                  getDepartmentName(departments, rowDepId);

                const baseSalary = r?.baseSalary ?? r?.raw?.baseSalary ?? 0;
                const daysWorked = r?.totalDaysWorked ?? r?.raw?.totalDaysWorked ?? 0;
                const net = r?.netSalary ?? r?.raw?.netSalary ?? 0;

                const st = r?.status ?? r?.raw?.status;
                const badge = statusBadge(st);

                return (
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
                      {departmentName || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap">
                      {formatVND(baseSalary)}
                    </td>

                    <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap">
                      {Number(daysWorked)}
                    </td>

                    <td className="px-6 py-4 text-right font-extrabold text-primary bg-primary/5 tabular-nums whitespace-nowrap">
                      {formatVND(net)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${badge.cls}`}
                      >
                        {badge.text}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && finalRows.length > 0 ? (
        <div className="px-6 pb-5">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      ) : null}
    </section>
  );
}