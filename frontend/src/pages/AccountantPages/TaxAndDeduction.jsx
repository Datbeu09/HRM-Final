import React, { useEffect, useMemo, useState, useCallback } from "react";
import { getPayrollApproval } from "../../api/payrollApproval.api";

/* ================= Helpers ================= */

const toNum = (v) => {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const formatVND = (n) => `${toNum(n).toLocaleString("vi-VN")} ₫`;

const currentYYYYMM = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

function calcGross(row) {
  const grossFromBackend = toNum(row?.grossSalary);
  if (grossFromBackend > 0) return grossFromBackend;
  return toNum(row?.baseSalary) + toNum(row?.totalAllowances);
}

function calcTax(row) {
  const taxFromBackend = toNum(row?.tax);
  if (taxFromBackend > 0) return taxFromBackend;

  const gross = calcGross(row);
  const ins = toNum(row?.totalInsurance);
  const net = toNum(row?.netSalary);

  const tax = gross - ins - net;
  return tax > 0 ? tax : 0;
}

/* ================= Page ================= */

export default function TaxAndDeduction() {
  const [month] = useState(currentYYYYMM());
  const [department] = useState(""); // nếu sau này muốn lọc departmentId thì mở ra

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPayrollApproval({
        month,
        department: department || undefined,
      });

      const list = Array.isArray(data?.employees) ? data.employees : [];
      setRows(list);
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "Fetch failed");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [month, department]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ===== chỉ map: nhân viên + thuế =====
  const tableRows = useMemo(() => {
    return (rows || []).map((r) => ({
      employeeId: r?.employeeId ?? null,
      employeeCode: r?.employeeCode ?? "",
      name: r?.name || "N/A",
      tax: calcTax(r),
      raw: r,
    }));
  }, [rows]);

  const totalTax = useMemo(() => {
    return tableRows.reduce((sum, r) => sum + toNum(r.tax), 0);
  }, [tableRows]);

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-text-main">
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-screen-2xl mx-auto space-y-6">

            {error ? (
              <div className="text-sm font-semibold text-red-600">{error}</div>
            ) : null}

            {/* SUMMARY: chỉ thuế */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <SummaryCard
                title="Tổng Thuế TNCN"
                value={loading ? "..." : formatVND(totalTax)}
                primary
              />
              <SummaryCard
                title="Số nhân viên"
                value={loading ? "..." : String(tableRows.length)}
              />
              <SummaryCard
                title="Kỳ lương"
                value={month}
              />
            </section>

            {/* TABLE: chỉ nhân viên + thuế */}
            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-background-light dark:bg-background-dark text-text-secondary">
                    <tr className="border-b border-border-light dark:border-border-dark">
                      <th className="px-6 py-4 text-left font-semibold">Nhân viên</th>
                      <th className="px-6 py-4 text-left font-semibold">Mã NV</th>
                      <th className="px-6 py-4 text-right font-semibold text-primary bg-primary/5">
                        Thuế TNCN
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border-light dark:divide-border-dark">
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-6 text-text-secondary">
                          Đang tải dữ liệu...
                        </td>
                      </tr>
                    ) : tableRows.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-6 text-text-secondary">
                          Không có dữ liệu.
                        </td>
                      </tr>
                    ) : (
                      tableRows.map((r) => (
                        <TableRow
                          key={r.employeeId || `${r.employeeCode}-${r.name}`}
                          name={r.name}
                          code={r.employeeCode}
                          tax={formatVND(r.tax)}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= COMPONENT PHỤ ================= */

function SummaryCard({ title, value, primary }) {
  return (
    <div
      className={`
        p-5 rounded-2xl border
        bg-white dark:bg-surface-dark
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-md
        ${primary ? "border-primary/30 bg-primary/5" : "border-border-light dark:border-border-dark"}
      `}
    >
      <p className="text-xs uppercase font-semibold tracking-wide text-text-secondary">
        {title}
      </p>
      <p
        className={`mt-2 text-2xl font-bold tabular-nums ${
          primary ? "text-primary" : "text-text-main"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function TableRow({ name, code, tax }) {
  return (
    <tr className="group transition hover:bg-background-light/60 dark:hover:bg-background-dark/60">
      <td className="px-6 py-4 font-medium">{name}</td>
      <td className="px-6 py-4 text-text-secondary">{code}</td>
      <td
        className="
          px-6 py-4 text-right font-bold tabular-nums
          text-primary bg-primary/5
          transition group-hover:bg-primary/10
        "
      >
        {tax}
      </td>
    </tr>
  );
}