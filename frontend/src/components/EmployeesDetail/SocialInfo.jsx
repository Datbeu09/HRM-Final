import React from "react";
import FormatDate from "../common/formatDate";

const SocialInfo = ({ employee, isEditing }) => {
  if (!employee) {
    return <div>Chưa có thông tin chính trị - xã hội</div>;
  }

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <Header title="Thông tin chính trị - xã hội" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* <Info label="Đảng viên" value={isEditing ? <input type="text" value={employee.politicalStatus} /> : employee.politicalStatus} />
        <Info label="Ngày vào Đảng" value={isEditing ? <input type="date" value={employee.politicalPartyDate || ""} /> : <FormatDate dateString={employee.politicalPartyDate} />} /> */}
        <Info label="Đảng viên" value={isEditing ? <input type="text" value={employee.youthUnionMember ? "Có" : "Không"} /> : (employee.youthUnionMember ? "Có" : "Không")} />
        <Info label="Ngày vào Đảng" value={isEditing ? <input type="date" value={employee.youthUnionDate || ""} /> : <FormatDate dateString={employee.youthUnionDate} />} />
        <Info label="Diện chính sách" value={isEditing ? <input type="text" value={employee.policyStatus} /> : employee.policyStatus} />
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

const Info = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="font-medium text-slate-900">{value}</p>
  </div>
);

export default SocialInfo;
