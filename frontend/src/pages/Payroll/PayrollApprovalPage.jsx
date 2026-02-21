import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  getPayrollApproval,
  exportPayrollToExcel,
  approveAndEmailPayroll,
  // handleUnapprove nếu bạn có API mở khóa thì import vào đây
  // unapprovePayroll,
} from "../../api/payrollApproval.api";
import { getDepartments } from "../../api/departments.api";

import PayrollAutoCheckBar from "../../components/payroll/PayrollAutoCheckBar";
import PayrollEmployeeTable from "../../components/payroll/PayrollEmployeeTable";
import PayrollToolbar from "../../components/payroll/PayrollToolbar";
import PayrollKpiCards from "../../components/payroll/PayrollKpiCards";
import PayrollHeaderControls from "../../components/payroll/PayrollHeaderControls";
import { normalizeResponse } from "../../components/payroll/payrollUtils";
import PayrollConfirmPopup from "../../components/Popup/PayrollConfirm";

/* ================= Status helpers (2 trạng thái) ================= */

const normalizeStatus2 = (status) => {
  const s = String(status || "").trim().toLowerCase();
  if (s === "đã duyệt") return "Đã duyệt";
  if (s === "chưa duyệt") return "Chưa duyệt";
  return status || "Chưa duyệt"; // default an toàn
};

const isRowApproved = (row) => {
  // ✅ chỉ tin status
  return normalizeStatus2(row?.status ?? row?.raw?.status) === "Đã duyệt";
};

export default function FinanceApprovalPage() {
  const [month, setMonth] = useState("2026-01");
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState("");

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("net_desc");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [kpi, setKpi] = useState({ gross: 0, tax: 0, ins: 0, net: 0 });
  const [rows, setRows] = useState([]);
  const [checkState, setCheckState] = useState(null);

  const [openConfirm, setOpenConfirm] = useState(false);

  // ✅ lấy email mặc định từ localStorage user (nếu có)
  const defaultEmail = useMemo(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      return u?.email || u?.MailADD || u?.mail || "";
    } catch {
      return "";
    }
  }, []);

  // ✅ ADMIN CHECK
  const isAdmin = useMemo(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      return String(u?.role || "").toUpperCase() === "ADMIN";
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setDepartments([]);
      }
    };
    fetchDepartments();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPayrollApproval({
        month,
        department: departmentId || undefined,
      });

      const normalized = normalizeResponse(data);

      // ✅ IMPORTANT: đảm bảo KHÔNG override status theo locked
      const safeEmployees = (normalized.employees || []).map((x) => ({
        ...x,
        status: normalizeStatus2(x?.status ?? x?.raw?.status),
      }));

      setKpi(normalized.kpi);
      setRows(safeEmployees);
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

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return (rows || []).filter(
      (x) =>
        String(x.employeeCode || "").toLowerCase().includes(qq) ||
        String(x.name || "").toLowerCase().includes(qq)
    );
  }, [rows, q]);

  const totalNetSalary = useMemo(() => {
    return (rows || []).reduce((sum, item) => sum + Number(item.netSalary || 0), 0);
  }, [rows]);

  // ✅ xác định đã chốt hay chưa (CHỈ dựa status)
  const isApproved = useMemo(() => {
    const salaryRows = (rows || []).filter((x) => x.id != null);
    if (salaryRows.length === 0) return false;
    return salaryRows.every((x) => isRowApproved(x));
  }, [rows]);

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
      link.download = `phieu_xuat_luong_tong_${month}${depSuffix}.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "Xuất file thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ chỉ mở popup nếu chưa chốt
  const handleApproveButton = () => {
    if (loading || submitting) return;

    // ✅ Nếu đã chốt: chỉ ADMIN mới được mở khóa
    if (isApproved) {
      if (!isAdmin) return;

      const ok = window.confirm(
        "Bạn có chắc muốn MỞ KHÓA bảng lương tháng này không?\n(Đã duyệt → Chưa duyệt)"
      );
      if (!ok) return;

      // ✅ Nếu bạn có API mở khóa thì gọi ở đây.
      // await unapprovePayroll({ month, department: departmentId || undefined })
      // await fetchData()

      alert("Bạn cần API mở khóa (unapprove) để cập nhật DB status='Chưa duyệt' và locked=0.");
      return;
    }

    // ✅ Chưa chốt -> mở popup ký -> chốt + gửi mail
    setOpenConfirm(true);
  };

  const handleConfirmApprove = async ({ toEmail }) => {
    if (loading || submitting) return;

    setSubmitting(true);
    setError("");
    try {
      await approveAndEmailPayroll({
        month,
        department: departmentId || undefined,
        toEmail,
      });

      await fetchData();
      alert("Đã chốt bảng lương và gửi file Excel qua email.");
      setOpenConfirm(false);
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "Chốt + gửi email thất bại");
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
            onExportFile={handleExportFile}
            onApprove={handleApproveButton}
            loading={loading}
            submitting={submitting}
            disableApprove={checkState?.allOk === false}
            isApproved={isApproved}
            isAdmin={isAdmin}
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

        <PayrollConfirmPopup
          isOpen={openConfirm}
          onClose={() => setOpenConfirm(false)}
          totalAmount={totalNetSalary}
          loading={submitting}
          onConfirm={handleConfirmApprove}
          isApproved={isApproved}
          monthLabel={month}
          departmentLabel={
            departmentId
              ? `Phòng ban: ${
                  departments.find((d) => String(d.id) === String(departmentId))
                    ?.departmentName || departmentId
                }`
              : "Tất cả phòng ban"
          }
          defaultEmail={defaultEmail}
        />
      </main>
    </div>
  );
}