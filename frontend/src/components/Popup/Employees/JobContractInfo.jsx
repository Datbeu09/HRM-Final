// src/components/Popup/Employees/JobContractInfo.jsx
import React, { useMemo } from "react";
import Field from "../../common/Field";

const normalizeContractTypeLabel = (v) => {
  const s = String(v || "").trim().toLowerCase();
  if (!s) return "";
  if (s === "hop_dong" || s.includes("hợp đồng")) return "Hợp đồng";
  if (s === "bien_che" || s.includes("biên chế")) return "Biên chế";
  return String(v || "").trim();
};

const JobContractInfo = ({ form, handleChange, options }) => {
  const departments = options?.departments || [];
  const positions = options?.positions || [];

  const contractTypes = useMemo(() => {
    const list = (options?.contractTypes || []).map(normalizeContractTypeLabel).filter(Boolean);
    return list.length ? Array.from(new Set(list)) : ["Hợp đồng", "Biên chế"];
  }, [options]);

  // ✅ chỉ hiện ngày kết thúc nếu là "Hợp đồng" (chuẩn hoá)
  const isContract = normalizeContractTypeLabel(form.contractType) === "Hợp đồng";

  return (
    <section className="space-y-4 pt-6 border-t border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
        <h2 className="text-lg font-semibold text-slate-900">Công việc &amp; Hợp đồng</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Field label="Phòng ban">
          <select
            name="department"
            value={form.department || ""}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
          >
            <option value="">-- Chọn --</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Chức danh">
          <select
            name="jobTitle"
            value={form.jobTitle || ""}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
          >
            <option value="">-- Chọn --</option>
            {positions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Trạng thái làm việc">
          <input
            name="workStatus"
            value={form.workStatus || ""}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
            type="text"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Field label="Loại nhân viên">
          <select
            name="contractType"
            value={form.contractType || ""}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
          >
            <option value="">-- Chọn --</option>
            {contractTypes.map((ct) => (
              <option key={ct} value={ct}>
                {ct}
              </option>
            ))}
          </select>
        </Field>

        {!!form.contractType && (
          <Field label="Ngày bắt đầu">
            <input
              name="contractStart"
              value={form.contractStart || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
              type="date"
            />
          </Field>
        )}

        {/* ✅ chỉ hiện ngày kết thúc nếu là Hợp đồng */}
        {isContract && (
          <Field label="Ngày kết thúc">
            <input
              name="contractEnd"
              value={form.contractEnd || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
              type="date"
            />
          </Field>
        )}
      </div>
    </section>
  );
};

export default JobContractInfo;
