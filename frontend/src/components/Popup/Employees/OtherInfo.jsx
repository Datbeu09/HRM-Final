import React from "react";
import Field from "../../common/Field";

const OtherInfo = ({ form, handleChange }) => {
  return (
    <section className="space-y-4 pt-6 border-t border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
        <h2 className="text-lg font-semibold text-slate-900">Thông tin khác</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Trình độ học vấn">
          <select
            name="education"
            value={form.education || ""}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
          >
            <option value="">-- Chọn --</option>
            <option>Đại học</option>
            <option>Cao đẳng</option>
            <option>Thạc sĩ</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
        <div className="flex items-center gap-3 py-2">
          <input
            id="party_member"
            name="partyMember"
            checked={!!form.partyMember}
            onChange={handleChange}
            className="w-5 h-5 rounded-md border-slate-300 text-emerald-600 focus:ring-4 focus:ring-emerald-500/15"
            type="checkbox"
          />
          <label
            className="text-sm font-semibold text-slate-800 cursor-pointer select-none"
            htmlFor="party_member"
          >
            Đảng viên
          </label>
        </div>

        <Field label="Ngày vào Đảng">
          <input
            name="partyJoinDate"
            value={form.partyJoinDate || ""}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
            type="date"
            disabled={!form.partyMember}
          />
        </Field>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Tên cha">
          <input
            name="fatherName"
            value={form.fatherName || ""}
            onChange={handleChange}
            placeholder="Nhập họ tên cha"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
            type="text"
          />
        </Field>

        <Field label="Tên mẹ">
          <input
            name="motherName"
            value={form.motherName || ""}
            onChange={handleChange}
            placeholder="Nhập họ tên mẹ"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
            type="text"
          />
        </Field>
      </div> */}
    </section>
  );
};

export default OtherInfo;
