import React from "react";

function Select({ value, onChange, options, icon }) {
  const normalized = options.map((o) => (typeof o === "string" ? { label: o, value: o } : o));
  return (
    <label className="flex items-center gap-2 px-4 h-11 rounded-xl border border-border bg-white text-sm font-semibold text-slate-700">
      <span className="material-symbols-outlined text-[18px] text-slate-500">{icon || "tune"}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent outline-none text-sm">
        {normalized.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function PayrollToolbar({
  q,
  setQ,
  sort,
  setSort,
  onAutoCheck,
  onRequestEdit,
  onApprove,
  loading,
  submitting,
  disableApprove,
}) {
  return (
    <section className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
      <div className="flex-1 flex gap-3">
        <div className="flex items-center gap-2 px-4 h-11 rounded-xl border border-border bg-white w-full lg:max-w-md">
          <span className="material-symbols-outlined text-slate-500 text-[18px]">search</span>
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
        <button
          onClick={onAutoCheck}
          disabled={loading || submitting}
          className="inline-flex items-center gap-2 px-4 h-11 rounded-xl border border-border bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">rule</span>
          Kiểm tra tự động
        </button>

        <button
          onClick={onRequestEdit}
          disabled={loading || submitting}
          className="inline-flex items-center gap-2 px-4 h-11 rounded-xl border border-red-200 text-red-600 bg-white text-sm font-semibold hover:bg-red-50 transition disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Yêu cầu chỉnh sửa
        </button>

        <button
          onClick={onApprove}
          disabled={loading || submitting || disableApprove}
          className="inline-flex items-center gap-2 px-4 h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Phê duyệt
        </button>
      </div>
    </section>
  );
}
