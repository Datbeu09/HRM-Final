import React, { useEffect, useMemo, useState } from "react";
import {
  getPayrollApproval,
  autoCheckPayroll,
  approvePayroll,
  requestPayrollEdit,
} from "../../api/payrollApproval.api";
import PayrollAutoCheckBar from "../../components/payroll/PayrollAutoCheckBar";
import PayrollEmployeeTable from "../../components/payroll/PayrollEmployeeTable";
import PayrollToolbar from "../../components/payroll/PayrollToolbar";
import PayrollKpiCards from "../../components/payroll/PayrollKpiCards";
import PayrollHeaderControls from "../../components/payroll/PayrollHeaderControls";

import { normalizeResponse } from "../../components/payroll/payrollUtils";

export default function FinanceApprovalPage() {
  const [month, setMonth] = useState("2026-05");
  const [department, setDepartment] = useState("Marketing");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("net_desc");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [kpi, setKpi] = useState({ gross: 0, tax: 0, ins: 0, net: 0 });
  const [rows, setRows] = useState([]); // normalized employees
  const [checkState, setCheckState] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPayrollApproval({ month, department });

      // ✅ debug xem data thật (mở console)
      console.log("[FE] payroll-approval raw =", data);

      const normalized = normalizeResponse(data);
      setKpi(normalized.kpi);
      setRows(normalized.employees);
      setCheckState(null);
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "Fetch failed");
      setRows([]);
      setKpi({ gross: 0, tax: 0, ins: 0, net: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, department]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    let r = rows.filter(
      (x) =>
        String(x.employeeCode || "").toLowerCase().includes(qq) ||
        String(x.name || "").toLowerCase().includes(qq)
    );

    r.sort((a, b) => {
      const an = Number(a.netSalary || 0);
      const bn = Number(b.netSalary || 0);

      if (sort === "net_desc") return bn - an;
      if (sort === "net_asc") return an - bn;
      if (sort === "name_asc") return String(a.name || "").localeCompare(String(b.name || ""));
      if (sort === "name_desc") return String(b.name || "").localeCompare(String(a.name || ""));
      return 0;
    });

    return r;
  }, [rows, q, sort]);

  const dataStatusLabel = useMemo(() => {
    if (loading) return "Đang tải...";
    if (error) return "Có lỗi dữ liệu";
    if (checkState?.allOk === false) return "Có sai lệch";
    return "Dữ liệu hợp lệ";
  }, [loading, error, checkState]);

  const dotColorClass = useMemo(() => {
    if (error) return "bg-red-500/70";
    if (checkState?.allOk === false) return "bg-amber-500/70";
    return "bg-green-500/70";
  }, [error, checkState]);

  const handleAutoCheck = async () => {
    setSubmitting(true);
    setError("");
    try {
      const data = await autoCheckPayroll({ month, department });
      setCheckState(data);
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "Auto-check failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async () => {
    setSubmitting(true);
    setError("");
    try {
      await approvePayroll({ month, department });
      await fetchData();
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "Approve failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestEdit = async () => {
    const reason = window.prompt("Nhập lý do yêu cầu chỉnh sửa:");
    if (!reason) return;

    setSubmitting(true);
    setError("");
    try {
      await requestPayrollEdit({ month, department, reason });
      await fetchData();
      alert("Đã gửi yêu cầu chỉnh sửa.");
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "Request edit failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light font-display">
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc]">
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          <PayrollHeaderControls
            month={month}
            setMonth={setMonth}
            department={department}
            setDepartment={setDepartment}
            onReload={fetchData}
            loading={loading}
            submitting={submitting}
            error={error}
          />

          <PayrollKpiCards kpi={kpi} />

          <PayrollToolbar
            q={q}
            setQ={setQ}
            sort={sort}
            setSort={setSort}
            onAutoCheck={handleAutoCheck}
            onRequestEdit={handleRequestEdit}
            onApprove={handleApprove}
            loading={loading}
            submitting={submitting}
            disableApprove={checkState?.allOk === false}
          />

          <PayrollEmployeeTable
            month={month}
            loading={loading}
            rows={rows}
            filtered={filtered}
            dataStatusLabel={dataStatusLabel}
            dotColorClass={dotColorClass}
          />

          <PayrollAutoCheckBar checkState={checkState} />
        </div>
      </main>
    </div>
  );
}
