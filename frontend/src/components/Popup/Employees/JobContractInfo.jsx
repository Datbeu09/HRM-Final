import React, { useMemo } from "react";
import Field from "../../common/Field";

// Hàm chuẩn hóa loại hợp đồng
const normalizeContractTypeLabel = (v) => {
  const s = String(v || "").trim().toLowerCase();
  if (!s) return "";
  if (s === "hop_dong" || s.includes("hợp đồng")) return "Hợp đồng";
  if (s === "bien_che" || s.includes("biên chế")) return "Biên chế";
  return String(v || "").trim();
};

const JobContractInfo = ({ form, handleChange, options, departments = [] }) => {
  const positions = options?.positions || [];

  // Cập nhật loại hợp đồng (hiển thị hợp đồng hoặc biên chế)
  const contractTypes = useMemo(() => {
    const list = (options?.contractTypes || []).map(normalizeContractTypeLabel).filter(Boolean);
    return list.length ? Array.from(new Set(list)) : ["Hợp đồng", "Biên chế"];
  }, [options]);

  // Kiểm tra loại hợp đồng có phải là "Hợp đồng" hay không
  const isContract = normalizeContractTypeLabel(form.contractType) === "Hợp đồng";

  // Hàm tìm tên phòng ban theo departmentId
  const getDepartmentName = (departmentId) => {
    const department = departments.find((d) => d.id === departmentId);
    return department ? department.departmentName : "N/A";
  };

  return (
    <section className="space-y-4 pt-6 border-t border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
        <h2 className="text-lg font-semibold text-slate-900">Công việc &amp; Hợp đồng</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Phòng ban */}
        <Field label="Phòng ban">
          <select
            name="departmentId" // Đảm bảo rằng bạn đang sử dụng "departmentId" để lưu giá trị
            value={form.departmentId || ""}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
          >
            <option value="">-- Chọn --</option>
            {departments && departments.length > 0 ? (
              departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.departmentName}
                </option>
              ))
            ) : (
              <option value="">Không có phòng ban</option>
            )}
          </select>
        </Field>

        {/* Chức danh */}
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

        {/* Trạng thái làm việc */}
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
        {/* Loại nhân viên */}
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

        {/* Ngày bắt đầu hợp đồng */}
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

        {/* ✅ Chỉ hiển thị Ngày kết thúc nếu là Hợp đồng */}
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