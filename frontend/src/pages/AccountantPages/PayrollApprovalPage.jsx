import React, { useMemo, useState } from "react";

/**
 * PayrollApprovalPage (UI/UX improved)
 * - Added header + breadcrumbs
 * - Added search + sort
 * - Better table styling and empty state
 * - Sticky action bar refined
 */

export default function PayrollApprovalPage() {
  const [month, setMonth] = useState("2026-05");
  const [department, setDepartment] = useState("Marketing");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("net_desc");

  // demo data (thay API sau)
  const kpi = useMemo(
    () => ({
      gross: "57,000,000₫",
      tax: "15,000,000 ₫",
      ins: "21,000,000 ₫",
      net: "21,000,000 ₫",
    }),
    []
  );

  const rows = useMemo(
    () => [
      { code: "NV001", name: "Nguyễn Văn A", net: 5125000 },
      { code: "NV021", name: "Trần Thị B", net: 3200000 },
      { code: "NV105", name: "Lê Văn C", net: 800000 },
    ],
    []
  );

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    let r = rows.filter(
      (x) =>
        x.code.toLowerCase().includes(qq) || x.name.toLowerCase().includes(qq)
    );

    r.sort((a, b) => {
      if (sort === "net_desc") return b.net - a.net;
      if (sort === "net_asc") return a.net - b.net;
      if (sort === "name_asc") return a.name.localeCompare(b.name);
      if (sort === "name_desc") return b.name.localeCompare(a.name);
      return 0;
    });

    return r;
  }, [rows, q, sort]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light font-display">
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc]">


        {/* ===== Content ===== */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

          {/* KPI cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <KPI icon="payments" title="Tổng quỹ lương (Gross)" value={kpi.gross} />
            <KPI icon="receipt_long" title="Tổng thuế TNCN" value={kpi.tax} />
            <KPI icon="health_and_safety" title="BHXH / BHYT" value={kpi.ins} />
            <KPI icon="verified_user" title="Thực lĩnh (Net Pay)" value={kpi.net} primary />
          </section>

          {/* Controls */}
          <section className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <div className="flex-1 flex gap-3">
              <div
                className="
                  flex items-center gap-2
                  px-4 h-11 rounded-xl
                  border border-border bg-white
                  w-full lg:max-w-md
                "
              >
                <span className="material-symbols-outlined text-slate-500 text-[18px]">
                  search
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm theo mã NV hoặc họ tên..."
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>

              <div className="hidden sm:flex">
                <Select
                  icon="sort"
                  value={sort}
                  onChange={setSort}
                  options={[
                    { label: "Thực lĩnh giảm dần", value: "net_desc" },
                    { label: "Thực lĩnh tăng dần", value: "net_asc" },
                    { label: "Tên A-Z", value: "name_asc" },
                    { label: "Tên Z-A", value: "name_desc" },
                  ]}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 px-4 h-11 rounded-xl border border-border bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                <span className="material-symbols-outlined text-[18px]">rule</span>
                Kiểm tra tự động
              </button>
              <button className="inline-flex items-center gap-2 px-4 h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export Excel
              </button>
            </div>
          </section>

          {/* Table */}
          <section className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Danh sách nhân viên
                </h3>
                <p className="text-sm text-slate-500">
                  {filtered.length} nhân viên • Tháng {labelMonth(month)}
                </p>
              </div>

              <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span className="w-2 h-2 rounded-full bg-green-500/70" />
                Dữ liệu hợp lệ
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
                    <th className="px-6 py-4 text-right font-semibold">Hành động</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10">
                        <EmptyState />
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r) => (
                      <tr key={r.code} className="transition hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-500">{r.code}</td>
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {r.name}
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold text-primary bg-primary/5 tabular-nums">
                          {formatVND(r.net)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button className="px-3 h-9 rounded-xl border border-border bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                              Chi tiết
                            </button>
                            <button className="px-3 h-9 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:opacity-90 transition">
                              Ghi chú
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Sticky Action bar */}
          <div
            className="
              sticky bottom-4
              bg-white border border-border
              px-4 sm:px-6 py-4
              rounded-2xl
              flex flex-col lg:flex-row
              gap-4 lg:gap-0
              justify-between items-start lg:items-center
              shadow-md
            "
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-green-600">
                verified_user
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Hệ thống đã kiểm tra tự động
                </p>
                <p className="text-xs text-slate-500">
                  Nếu có sai lệch, hãy “Yêu cầu chỉnh sửa” trước khi trình duyệt.
                </p>
              </div>
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <button
                className="
                  flex-1 lg:flex-none
                  px-6 h-11 rounded-xl
                  border border-red-200
                  text-red-600 font-semibold
                  transition
                  hover:bg-red-50
                "
              >
                Yêu cầu chỉnh sửa
              </button>

              <button
                className="
                  flex-1 lg:flex-none
                  px-6 h-11 rounded-xl
                  bg-primary text-white font-semibold
                  transition
                  hover:bg-primary/90
                  hover:shadow-lg
                "
              >
                Phê duyệt &amp; Trình Giám đốc
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

/* ================= UI bits ================= */

function KPI({ title, value, primary, icon }) {
  return (
    <div
      className={`
        relative p-6 rounded-2xl border
        bg-white shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg
        ${primary ? "border-primary/30 bg-primary/5" : "border-border"}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
          {title}
        </p>
        <span
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            ${primary ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-600"}
          `}
        >
          <span className="material-symbols-outlined text-[20px]">
            {icon}
          </span>
        </span>
      </div>

      <p className={`mt-2 text-3xl font-extrabold tabular-nums ${primary ? "text-primary" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}

function MonthPicker({ value, onChange }) {
  return (
    <label
      className="
        flex items-center gap-2
        px-4 h-11 rounded-xl
        border border-border bg-white
        text-sm font-semibold text-slate-700
      "
    >
      <span className="material-symbols-outlined text-[18px] text-slate-500">
        calendar_month
      </span>
      <input
        type="month"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none text-sm"
      />
    </label>
  );
}

function Select({ value, onChange, options, icon }) {
  const normalized = options.map((o) =>
    typeof o === "string" ? { label: o, value: o } : o
  );

  return (
    <label
      className="
        flex items-center gap-2
        px-4 h-11 rounded-xl
        border border-border bg-white
        text-sm font-semibold text-slate-700
      "
    >
      <span className="material-symbols-outlined text-[18px] text-slate-500">
        {icon || "tune"}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none text-sm"
      >
        {normalized.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

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

/* ================= Helpers ================= */

function labelMonth(ym) {
  const [y, m] = String(ym).split("-");
  return `${m}/${y}`;
}

function formatVND(n) {
  // n is number
  const s = Number(n || 0).toLocaleString("vi-VN");
  return `${s} ₫`;
}
