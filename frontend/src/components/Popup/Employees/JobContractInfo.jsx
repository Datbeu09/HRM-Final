import React from "react";
import Field from "../../common/Field";

const JobContractInfo = ({ form, handleChange }) => {
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
            <option>Hành chính</option>
            <option>Kỹ thuật</option>
            <option>Kinh doanh</option>
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
            <option>Trưởng phòng</option>
            <option>Nhân viên</option>
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
            <option value="HOP_DONG">Hợp đồng</option>
            <option value="BIEN_CHE">Biên chế</option>
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

        {form.contractType === "HOP_DONG" && (
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
