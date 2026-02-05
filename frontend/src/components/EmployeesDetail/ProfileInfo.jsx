import React from "react";
import Info from "../common/Info";
import HeaderTitle from "./HeaderTitle";

const ProfileInfo = ({ employee, departmentName, isEditing }) => {
  if (!employee) {
    return <div className="text-center text-slate-500">Chưa có thông tin hồ sơ</div>;
  }

  const box =
    "bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6";
  const label =
    "text-slate-400 uppercase text-[11px] font-medium tracking-wide";
  const value = "font-semibold text-slate-700 dark:text-slate-300";

  return (
    <section className={box}>
      <HeaderTitle title="Thông tin cá nhân" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Info label="Mã Nhân Viên" value={isEditing ? <input type="text" value={employee.employeeCode} /> : employee.employeeCode} />
        <Info label="Họ và tên" value={isEditing ? <input type="text" value={employee.name} /> : employee.name} />
        <Info label="Ngày sinh" value={isEditing ? <input type="date" value={employee.dob ? new Date(employee.dob).toLocaleDateString() : ""} /> : (employee.dob ? new Date(employee.dob).toLocaleDateString() : "N/A")} />
        <Info label="Phòng ban" value={isEditing ? <input type="text" value={departmentName} /> : departmentName} /> {/* Hiển thị tên phòng ban */}
        <Info label="Loại nhân viên" value={isEditing ? <input type="text" value={employee.contractType} /> : employee.contractType} />
        <Info label="Giới tính" value={isEditing ? <input type="text" value={employee.gender} /> : employee.gender} />
        <Info label="Địa chỉ" value={isEditing ? <input type="text" value={employee.address} /> : employee.address} />
        <Info label="Số điện thoại" value={isEditing ? <input type="text" value={employee.phone} /> : employee.phone} />
        <Info label="Email" value={isEditing ? <input type="email" value={employee.email} /> : employee.email} />
      </div>
    </section>
  );
};
export default ProfileInfo;