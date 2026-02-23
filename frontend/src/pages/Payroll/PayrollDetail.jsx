// src/pages/accountant/PayrollDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getPayrollDetail } from "../../api/payrollDetail.api";
import { sendPayslipEmail } from "../../api/payslipMail.api";

/* ================= Helpers ================= */

const toNum = (v) => {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const formatVND = (n) => `${Number(n || 0).toLocaleString("vi-VN")} ₫`;

const labelMonth = (ym) => {
  const m = String(ym || "").match(/^(\d{4})-(\d{2})$/);
  if (!m) return ym || "";
  return `${m[2]}/${m[1]}`;
};

const statusBadge = (status) => {
  const s = String(status || "").trim().toLowerCase();

  if (s === "missing") {
    return {
      text: "Chưa có bảng lương",
      cls: "bg-slate-100 dark:bg-slate-800/40 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700",
    };
  }

  if (s === "đã duyệt") {
    return {
      text: "Đã duyệt",
      cls: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    };
  }

  return {
    text: "Chưa duyệt",
    cls: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  };
};

/**
 * normalize payload backend -> UI model (chịu nhiều shape)
 * ✅ FIX: totalIncome/gross + tax suy ra đúng, không bị agreedSalary nuốt mất phụ cấp
 */
function normalizeDetail(payload, monthStr) {
  const employee = payload?.employee || payload?.emp || {};
  const payrollRaw = payload?.payroll ?? payload?.monthlySalary ?? payload?.salary ?? null;

  const allowances = Array.isArray(payload?.allowances) ? payload.allowances : [];
  const attendance = payload?.attendance || payload?.monthlyAttendance || null;

  // ===== Nếu chưa có payroll => vẫn render được UI =====
  if (!payrollRaw) {
    return {
      employee: {
        id: employee?.id ?? null,
        employeeCode: employee?.employeeCode || employee?.code || "",
        name: employee?.name || "",
        title: employee?.title || "",
        position: employee?.position || "",
        department: employee?.departmentName || employee?.department || "",
      },
      payroll: {
        month: monthStr || "",
        status: "Missing",
        locked: false,
        totalDaysWorked: toNum(attendance?.totalDaysWorked ?? 0),
        netSalary: 0,
      },
      incomeItems: [],
      deductItems: [],
      summary: { totalIncome: 0, totalDeduct: 0, net: 0 },
      flags: payload?.flags || {},
      raw: payload,
    };
  }

  const payroll = payrollRaw;

  // ===== Thu nhập =====
  const incomeItems = [];

  // 1) Lương cơ bản
  const base = toNum(payroll.baseSalary ?? 0);
  incomeItems.push({
    key: "baseSalary",
    label: "Lương cơ bản",
    value: base,
  });

  // 2) ✅ Tổng Phụ cấp & Thưởng
  const sumAllowancesFromList = (allowances || []).reduce(
    (acc, a) => acc + toNum(a?.amount ?? a?.value ?? 0),
    0
  );

  const totalAllowancesField = toNum(payroll.totalAllowances ?? 0);
  const allowanceTotalValue = totalAllowancesField > 0 ? totalAllowancesField : sumAllowancesFromList;

  incomeItems.push({
    key: "allowanceBonus",
    label: "Phụ cấp & Thưởng",
    value: allowanceTotalValue,
    sub: totalAllowancesField > 0 ? "Theo monthlysalary.totalAllowances" : "Suy ra từ danh sách allowances",
  });

  // 3) Chi tiết allowances (nếu có)
  for (const a of allowances) {
    incomeItems.push({
      key: `allow_${a.id || a.name || Math.random()}`,
      label: a.name || a.type || "Phụ cấp",
      value: toNum(a.amount ?? a.value ?? 0),
      sub: a.applyByAttendance ? "Áp dụng theo chấm công" : a.calcType ? `calcType: ${a.calcType}` : "",
    });
  }

  // ===== ✅ FIX: Tổng thu nhập (Gross / Total income) =====
  // Ưu tiên grossSalary nếu backend có, nếu không thì base + allowanceTotalValue.
  // agreedSalary KHÔNG được phép “nuốt” allowances như trước.
  const grossByParts = base + allowanceTotalValue;
  const grossFromBackend = toNum(payroll.grossSalary ?? 0);
  const agreed = toNum(payroll.agreedSalary ?? 0);

  const totalIncome = Math.max(grossFromBackend || grossByParts, grossByParts, agreed);

  // ===== Khấu trừ =====
  const ins = toNum(payroll.totalInsurance ?? 0);
  const net = toNum(payroll.netSalary ?? 0);

  // tax: nếu backend có field tax thì dùng; nếu không suy ra
  let tax = toNum(payroll.tax ?? 0);
  if (!tax) {
    tax = totalIncome - ins - net;
    if (tax < 0) tax = 0;
  }

  const deductItems = [
    { key: "insurance", label: "BHXH / BHYT / BHTN", value: ins, sub: "" },
    {
      key: "tax",
      label: "Thuế TNCN",
      value: tax,
      sub: "Tính suy ra (totalIncome - ins - net) nếu chưa có field riêng",
    },
  ];

  const totalDeduct = ins + tax;

  return {
    employee: {
      id: employee.id ?? payroll.employeeId ?? null,
      employeeCode: employee.employeeCode || employee.code || "",
      name: employee.name || "",
      title: employee.title || "",
      position: employee.position || "",
      department: employee.departmentName || employee.department || "",
    },
    payroll: {
      month: monthStr || "",
      status: payroll.status || payload?.status || "Pending",
      locked: !!payroll.locked,
      totalDaysWorked: toNum(payroll.totalDaysWorked ?? attendance?.totalDaysWorked ?? 0),
      netSalary: net,
    },
    incomeItems,
    deductItems,
    summary: { totalIncome, totalDeduct, net },
    flags: payload?.flags || {},
    raw: payload,
  };
}

/* ================= Page ================= */

export default function PayrollDetail() {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const [searchParams] = useSearchParams();
  const month = searchParams.get("month") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [model, setModel] = useState(null);

  const [sending, setSending] = useState(false);

  const badge = useMemo(() => statusBadge(model?.payroll?.status), [model?.payroll?.status]);

  const fetchDetail = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getPayrollDetail({ employeeId, month });
      const normalized = normalizeDetail(data, month);
      setModel(normalized);
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e?.message || "Fetch payroll detail failed");
      setModel(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!employeeId || !month) return;

    const prStatus = String(model?.payroll?.status || "").toLowerCase();
    if (prStatus === "missing") {
      alert("Chưa có bảng lương để gửi email.");
      return;
    }

    try {
      setSending(true);
      await sendPayslipEmail({ employeeId, month });
      alert("Đã gửi phiếu lương qua email tới deaftt09@gmail.com");
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || e?.message || "Gửi email thất bại");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!employeeId || !month) {
      setLoading(false);
      setError("Thiếu employeeId hoặc month trên URL (vd: /accountant/payroll/7?month=2026-05)");
      return;
    }
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, month]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark p-8 text-gray-800">
        <div className="text-slate-600">Đang tải chi tiết bảng lương...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark p-8 text-gray-800">
        <div className="mb-4 text-red-600 font-semibold">{error}</div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-800"
          >
            Quay lại
          </button>
          <button
            onClick={fetchDetail}
            className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-800"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const emp = model?.employee || {};
  const pr = model?.payroll || {};
  const incomeItems = model?.incomeItems || [];
  const deductItems = model?.deductItems || [];
  const summary = model?.summary || { totalIncome: 0, totalDeduct: 0, net: 0 };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8 text-gray-800">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <span className="material-icons-round text-[18px]">arrow_back</span>
          Quay lại
        </button>

        <button
          onClick={fetchDetail}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <span className="material-icons-round text-[18px]">refresh</span>
          Tải lại
        </button>
      </div>

      {/* Thông tin nhân viên */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
            <span className="material-icons-round text-4xl">account_circle</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{emp.name || "—"}</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Mã nhân viên: {emp.employeeCode || "—"}
              {" • "}
              Chức vụ: {emp.position || emp.title || "—"}
              {emp.department ? ` • Phòng: ${emp.department}` : ""}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 uppercase font-semibold">
            Kỳ lương tháng {labelMonth(month)}
          </p>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${badge.cls}`}>{badge.text}</span>
        </div>
      </div>

      {/* Nếu chưa có payroll */}
      {String(pr.status || "").toLowerCase() === "missing" ? (
        <div className="mb-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6">
          <div className="text-slate-700 dark:text-slate-200 font-semibold">
            Chưa có bảng lương cho tháng {labelMonth(month)}.
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Bạn hãy tạo dữ liệu monthlysalary cho nhân viên này hoặc kiểm tra lại employeeId / month-year trong DB.
          </div>
        </div>
      ) : null}

      {/* Thu nhập & Khấu trừ */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-100 dark:divide-gray-800">
          {/* Thu nhập */}
          <div className="p-8">
            <h3 className="text-lg font-bold uppercase tracking-wide text-primary mb-6">Các khoản thu nhập</h3>

            {incomeItems.length === 0 ? (
              <div className="text-sm text-gray-500">Không có dữ liệu thu nhập.</div>
            ) : (
              incomeItems.map((it) => (
                <IncomeItem key={it.key} label={it.label} value={formatVND(it.value)} sub={it.sub} />
              ))
            )}
          </div>

          {/* Khấu trừ */}
          <div className="p-8 bg-gray-50/50 dark:bg-gray-800/20">
            <h3 className="text-lg font-bold uppercase tracking-wide text-red-500 mb-6">Các khoản khấu trừ</h3>

            {deductItems.length === 0 ? (
              <div className="text-sm text-gray-500">Không có dữ liệu khấu trừ.</div>
            ) : (
              deductItems.map((it) => (
                <DeductItem key={it.key} label={it.label} value={`- ${formatVND(it.value)}`} sub={it.sub} />
              ))
            )}
          </div>
        </div>

        {/* Tổng kết */}
        <div className="p-8 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Summary label="TỔNG THU NHẬP" value={formatVND(summary.totalIncome)} />
            <Summary label="TỔNG KHẤU TRỪ" value={formatVND(summary.totalDeduct)} danger />
            <Summary label="THỰC LĨNH (NET PAY)" value={formatVND(summary.net)} highlight />
          </div>

          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Tổng ngày công: <b>{pr.totalDaysWorked}</b> • Locked: <b>{pr.locked ? "Yes" : "No"}</b>
          </div>
        </div>
      </div>

      {/* Footer hành động */}
      <div className="mt-8 flex items-center justify-between p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="text-green-600 text-sm font-medium">
          ✔ Bảng lương đã được hệ thống kiểm tra và khớp dữ liệu chấm công (nếu có)
        </div>

        {/* ✅ CHỈ CÒN NÚT GỬI EMAIL */}
        <div className="flex gap-4">
          <button
            onClick={handleSendEmail}
            disabled={sending || String(pr.status || "").toLowerCase() === "missing"}
            className="px-6 py-2 border font-bold rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
            title={String(pr.status || "").toLowerCase() === "missing" ? "Chưa có bảng lương để gửi email" : ""}
          >
            {sending ? "Đang gửi..." : "Gửi email phiếu lương"}
          </button>
        </div>
      </div>

      {/* Debug (nếu cần bật) */}
      {/* <pre className="mt-6 text-xs bg-white p-4 rounded">{JSON.stringify(model?.raw, null, 2)}</pre> */}
    </div>
  );
}

/* ================= Components ================= */

function IncomeItem({ label, value, sub }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-800">
      <div className="flex flex-col">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        {sub ? <span className="text-[10px] text-primary italic mt-1">{sub}</span> : null}
      </div>
      <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

function DeductItem({ label, value, sub }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800">
      <div className="flex flex-col">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        {sub ? <span className="text-[10px] text-gray-400 italic mt-1">{sub}</span> : null}
      </div>
      <span className="font-semibold text-red-500">{value}</span>
    </div>
  );
}

function Summary({ label, value, danger, highlight }) {
  return (
    <div className={`flex flex-col ${highlight ? "items-end" : "items-start"}`}>
      <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</span>
      <span
        className={`font-bold ${
          highlight ? "text-4xl text-primary" : danger ? "text-2xl text-red-500" : "text-2xl text-gray-800 dark:text-gray-200"
        }`}
      >
        {value}
      </span>
    </div>
  );
}