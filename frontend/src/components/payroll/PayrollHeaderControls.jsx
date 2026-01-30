import React from "react";

export default function PayrollHeaderControls({
  month,
  setMonth,
  department,
  setDepartment,

  // ✅ danh sách từ API /departments
  departments = [],

  onReload,
  loading,
  submitting,
  error,
}) {
  return (
    <section className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
      <div className="flex gap-2 flex-wrap">
        <label className="flex items-center gap-2 px-4 h-11 rounded-xl border border-border bg-white text-sm font-semibold text-slate-700">
          <span className="material-symbols-outlined text-[18px] text-slate-500">
            calendar_month
          </span>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-transparent outline-none text-sm"
          />
        </label>

        {/* ✅ Department select */}
        <label className="flex items-center gap-2 px-4 h-11 rounded-xl border border-border bg-white text-sm font-semibold text-slate-700">
          <span className="material-symbols-outlined text-[18px] text-slate-500">
            apartment
          </span>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            disabled={loading || submitting}
            className="bg-transparent outline-none text-sm w-[220px] disabled:opacity-60"
          >
            <option value="">Tất cả phòng ban</option>

            {departments.map((d) => (
              <option key={d.id ?? d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={onReload}
          disabled={loading || submitting}
          className="inline-flex items-center gap-2 px-4 h-11 rounded-xl border border-border bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Tải lại
        </button>
      </div>

      {error ? (
        <div className="text-sm text-red-600 font-semibold">{error}</div>
      ) : null}
    </section>
  );
}
