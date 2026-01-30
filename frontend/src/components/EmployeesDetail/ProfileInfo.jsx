import React from "react";
import Info from "../common/Info";

const ProfileInfo = ({ employee, isEditing }) => {
  if (!employee) {
    return <div>Chưa có thông tin hồ sơ</div>;
  }

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <Header title="Thông tin cá nhân" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Info label="Mã Nhân Viên" value={isEditing ? <input type="text" value={employee.employeeCode} /> : employee.employeeCode} />
        <Info label="Họ và tên" value={isEditing ? <input type="text" value={employee.name} /> : employee.name} />
        <Info label="Ngày sinh" value={isEditing ? <input type="date" value={employee.dob ? new Date(employee.dob).toLocaleDateString() : ""} /> : (employee.dob ? new Date(employee.dob).toLocaleDateString() : "N/A")} />
        <Info label="Phòng ban" value={isEditing ? <input type="text" value={employee.department} /> : employee.department} />
        <Info label="Loại nhân viên" value={isEditing ? <input type="text" value={employee.contractType} /> : employee.contractType} />
        <Info label="Giới tính" value={isEditing ? <input type="text" value={employee.gender} /> : employee.gender} />
        <Info label="Địa chỉ" value={isEditing ? <input type="text" value={employee.address} /> : employee.address} />
        <Info label="Số điện thoại" value={isEditing ? <input type="text" value={employee.phone} /> : employee.phone} />
        <Info label="Email" value={isEditing ? <input type="email" value={employee.email} /> : employee.email} />
        {/* <Info label="Trạng thái công việc" value={isEditing ? <input type="text" value={employee.workStatus} /> : employee.workStatus} /> */}
        {/* <Info label="Chức danh" value={isEditing ? <input type="text" value={employee.jobTitle} /> : employee.jobTitle} /> */}
        {/* <Info label="Chính sách" value={isEditing ? <input type="text" value={employee.policyStatus} /> : employee.policyStatus} /> */}
        <div>
 
</div>

      </div>
    </section>
  );
};


const Header = ({ title }) => (
  <div className="flex items-center gap-2 mb-6">
    <span className="w-1 h-6 bg-teal-600 rounded-full" />
    <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
  </div>
);



export default ProfileInfo;
