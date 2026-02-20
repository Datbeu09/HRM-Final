import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  getPayrollApproval,
  sendPayrollEmail,
  exportPayrollToExcel,
  approvePayroll,
} from "../../api/payrollApproval.api";
import { getDepartments } from "../../api/departments.api";

import PayrollAutoCheckBar from "../../components/payroll/PayrollAutoCheckBar";
import PayrollEmployeeTable from "../../components/payroll/PayrollEmployeeTable";
import PayrollToolbar from "../../components/payroll/PayrollToolbar";
import PayrollKpiCards from "../../components/payroll/PayrollKpiCards";
import PayrollHeaderControls from "../../components/payroll/PayrollHeaderControls";

import { normalizeResponse } from "../../components/payroll/payrollUtils";

export default function FinanceApprovalPage() {
  const [month, setMonth] = useState("2026-01");
  const [departments, setDepartments] = useState([]);

  // ✅ departmentId (number/string) — CHỌN THEO ID
  const [departmentId, setDepartmentId] = useState("");

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("net_desc");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [kpi, setKpi] = useState({ gross: 0, tax: 0, ins: 0, net: 0 });
  const [rows, setRows] = useState([]);
  const [checkState, setCheckState] = useState(null);

  // ===== Fetch Departments =====
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("[FE] Fetch departments failed", e);
        setDepartments([]);
      }
    };
    fetchDepartments();
  }, []);

  // ✅ Debug đúng chỗ (sau khi departments / rows thay đổi)
  useEffect(() => {
    if (departments?.length) console.log("departments[0]:", departments?.[0]);
  }, [departments]);

  useEffect(() => {
    if (rows?.length) console.log("rows[0]:", rows?.[0]);
  }, [rows]);

  // ===== Fetch Payroll Approval Data =====
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPayrollApproval({
        month,
        // ✅ gửi departmentId lên BE
        department: departmentId || undefined,
      });

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
  }, [month, departmentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ===== Filter search =====
  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return (rows || []).filter(
      (x) =>
        String(x.employeeCode || "").toLowerCase().includes(qq) ||
        String(x.name || "").toLowerCase().includes(qq)
    );
  }, [rows, q]);

  // ===== UI Status =====
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

  // ===== Actions =====
  const handleSendEmail = async () => {
    if (loading || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await sendPayrollEmail({ month, department: departmentId || undefined });
      alert("Phiếu lương đã được gửi qua email.");
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "Gửi phiếu lương thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportFile = async () => {
    if (loading || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const blob = await exportPayrollToExcel({
        month,
        department: departmentId || undefined,
      });

      if (!blob) throw new Error("Không nhận được file từ server.");

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const depSuffix = departmentId ? `_dep${departmentId}` : "";
      link.download = `payroll_${month}${depSuffix}.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      alert("File Excel đã được xuất.");
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "Xuất file thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (loading || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await approvePayroll({ month, department: departmentId || undefined });
      await fetchData();
      alert("Bảng lương đã được chốt thành công.");
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "Chốt bảng lương thất bại");
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
            departmentId={departmentId}
            setDepartmentId={setDepartmentId}
            departments={departments}
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
            onSendEmail={handleSendEmail}
            onExportFile={handleExportFile}
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
            departmentId={departmentId}
            departments={departments}
            dataStatusLabel={dataStatusLabel}
            dotColorClass={dotColorClass}
          />

          <PayrollAutoCheckBar checkState={checkState} />
        </div>
      </main>
    </div>
  );
}