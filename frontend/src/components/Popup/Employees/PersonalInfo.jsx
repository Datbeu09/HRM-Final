import React from "react";
import Field from "../../common/Field";

const PersonalInfo = ({ form, handleChange }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
        <h2 className="text-lg font-semibold text-slate-900">Thông tin cá nhân</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Field label="Mã nhân viên">
          <input
            name="employeeCode"
            value={form.employeeCode || ""}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
            type="text"
          />
        </Field>

        <Field label="Họ tên">
          <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            placeholder="Nhập họ tên"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
            type="text"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Field label="Ngày sinh">
          <input
            name="dob"
            value={form.dob || ""}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
            type="date"
          />
        </Field>

        <Field label="Giới tính">
          <select
            name="gender"
            value={form.gender || ""}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition appearance-none"
          >
            <option value="">-- Chọn --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </Field>

        <Field label="Số điện thoại">
          <input
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            placeholder="0xxx xxx xxx"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
            type="tel"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Email">
          <input
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            placeholder="example@company.com"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
            type="email"
          />
        </Field>

        <Field label="Địa chỉ">
          <input
            name="address"
            value={form.address || ""}
            onChange={handleChange}
            placeholder="Số nhà, tên đường, phường/xã..."
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition"
            type="text"
          />
        </Field>
      </div>
    </section>
  );
};

export default PersonalInfo;
