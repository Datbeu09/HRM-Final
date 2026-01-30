// src/components/Popup/Employees/OtherInfo.jsx
import React, { useMemo } from "react";
import Field from "../../common/Field";

const fallbackEduLevels = ["Đại học", "Cao đẳng", "Thạc sĩ"];

const OtherInfo = ({ form, handleChange, options }) => {
  const eduLevels = useMemo(() => {
    const list = options?.educations || [];
    return list.length ? list : fallbackEduLevels;
  }, [options]);

  return (
    <section className="space-y-4 pt-6 border-t border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
        <h2 className="text-lg font-semibold text-slate-900">Học vấn</h2>
      </div>

      {/* ✅ HỌC VẤN - đầy đủ field (degree, fieldOfStudy, ...) */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Trình độ ">
            <select
              name="educationLevel"
              value={form.educationLevel || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
            >
              <option value="">-- Chọn --</option>
              {eduLevels.map((lv) => (
                <option key={lv} value={lv}>
                  {lv}
                </option>
              ))}
            </select>
          </Field>

          {/* <Field label="Bằng cấp">
            <input
              name="degree"
              value={form.degree || ""}
              onChange={handleChange}
              placeholder=" Cử nhân"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
              type="text"
            />
          </Field> */}

          <Field label="Chuyên ngành">
            <input
              name="fieldOfStudy"
              value={form.fieldOfStudy || ""}
              onChange={handleChange}
              placeholder="Quản trị nhân sự"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
              type="text"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Trường (institution)">
            <input
              name="institution"
              value={form.institution || ""}
              onChange={handleChange}
              placeholder=" Đại học Kinh tế Quốc dân"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
              type="text"
            />
          </Field>

          <Field label="Năm tốt nghiệp">
            <input
              name="graduationYear"
              value={form.graduationYear || ""}
              onChange={handleChange}
              placeholder="2018"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
              type="number"
              min="1900"
              max="2100"
            />
          </Field>

          <Field label="Ngoại ngữ">
            <input
              name="foreignLanguageProficiency"
              value={form.foreignLanguageProficiency || ""}
              onChange={handleChange}
              placeholder=" Tiếng Anh giao tiếp"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
              type="text"
            />
          </Field>
        </div>
      </div>
      {/* ĐẢNG VIÊN */}
      <div className="flex items-center gap-3 mb-4 ">
        <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
        <h2 className="text-lg font-semibold text-slate-900">Thông tin khác</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end pt-6 ">
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
    </section>
  );
};

export default OtherInfo;
