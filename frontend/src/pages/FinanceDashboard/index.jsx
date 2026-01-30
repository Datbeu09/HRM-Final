import React, { useEffect, useMemo, useState } from "react";

import FinanceSummaryCard from "../../components/FinanceDetail/FinanceSummaryCard";
import FinanceStructureCard from "../../components/FinanceDetail/FinanceStructureCard";
import FinanceEmployeeTable from "../../components/FinanceDetail/FinanceEmployeeTable";
import Pagination from "../../components/common/Pagination";

import { getEmployees } from "../../api/employees.api";
import { getAllMonthlySalary } from "../../api/monthlySalary.api";

const toInt = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

export default function FinanceDashboard() {
  const [allRows, setAllRows] = useState([]);   // 🔥 toàn bộ data
  const [page, setPage] = useState(1);
  const pageSize = 5; // 👉 đổi số dòng / trang tuỳ bạn
  const [loading, setLoading] = useState(true);

  /* =======================
     FETCH DATA
  ======================= */
  useEffect(() => {
    const run = async () => {
      setLoading(true);

      const [employees, salariesRes] = await Promise.all([
        getEmployees(),
        getAllMonthlySalary(),
      ]);

      const salaries = Array.isArray(salariesRes)
        ? salariesRes
        : Array.isArray(salariesRes?.data)
        ? salariesRes.data
        : [];

      const empMap = new Map(employees.map((e) => [String(e.id), e]));

      const rows = salaries
        .map((s) => {
          const emp = empMap.get(String(s.employeeId));
          if (!emp) return null;

          return {
            code: emp.employeeCode,
            name: emp.name,
            base: toInt(s.baseSalary),
            attendance: s.totalDaysWorked ?? "--",
            bonus: toInt(s.totalAllowances),
            deduction: -toInt(s.totalInsurance),
            net: toInt(s.netSalary),
            status: s.status,
            updatedAt: s.updated_at,
          };
        })
        .filter(Boolean);

      setAllRows(rows);
      setLoading(false);
    };

    run().catch((e) => {
      console.error(e);
      setAllRows([]);
      setLoading(false);
    });
  }, []);

  /* =======================
     PAGING
  ======================= */
  const totalPages = Math.ceil(allRows.length / pageSize);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return allRows.slice(start, start + pageSize);
  }, [allRows, page]);

  /* reset page nếu data thay đổi */
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  /* =======================
     TOTALS (tính trên TOÀN BỘ)
  ======================= */
  const totals = useMemo(() => {
    return {
      sumBase: allRows.reduce((s, r) => s + r.base, 0),
      sumBonus: allRows.reduce((s, r) => s + r.bonus, 0),
      sumDed: allRows.reduce((s, r) => s + r.deduction, 0),
      sumNet: allRows.reduce((s, r) => s + r.net, 0),
    };
  }, [allRows]);

  /* =======================
     STRUCTURE + SUMMARY
  ======================= */
  const structure = useMemo(() => {
    const salary = totals.sumBase;
    const bonus = totals.sumBonus;
    const deduction = Math.abs(totals.sumDed);
    const total = salary + bonus + deduction || 1;

    return {
      salary: Math.round((salary / total) * 100),
      bonus: Math.round((bonus / total) * 100),
      deduction: Math.round((deduction / total) * 100),
    };
  }, [totals]);

  const summary = useMemo(() => {
    const statuses = allRows.map((r) => String(r.status || "").toUpperCase());
    const hasRejected = statuses.some((s) => s.includes("TỪ") || s.includes("REJECT"));
    const allApproved =
      statuses.length > 0 &&
      statuses.every((s) => s.includes("DUYỆT") || s.includes("APPROV"));

    const status = hasRejected ? "REJECTED" : allApproved ? "APPROVED" : "PENDING";

    const latest =
      allRows
        .map((r) => r.updatedAt)
        .filter(Boolean)
        .sort()
        .slice(-1)[0] || null;

    return {
      total: `${totals.sumNet.toLocaleString("vi-VN")} ₫`,
      status,
      updatedAt: latest ? new Date(latest).toLocaleDateString("vi-VN") : "--",
    };
  }, [allRows, totals.sumNet]);

  if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;

  return (
    <div className="pb-28">
      {/* TOP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <FinanceSummaryCard summary={summary} />
        </div>
        <FinanceStructureCard structure={structure} />
      </div>

      {/* TABLE */}
      <div className="mt-6">
        <FinanceEmployeeTable rows={pagedRows} totals={totals} />

        {/* PAGINATION */}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {allRows.length === 0 && (
        <div className="mt-4 text-sm text-slate-500">
          Không có dữ liệu bảng lương.
        </div>
      )}
    </div>
  );
}
