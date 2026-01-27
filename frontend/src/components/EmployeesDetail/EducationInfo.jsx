import React from "react";

const EducationInfo = ({ employee, isEditing }) => {
  if (!employee) {
    return <div>Chưa có thông tin trình độ</div>;
  }

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <Header title="Trình độ chuyên môn" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Info label="Trình độ / Bằng cấp" value={isEditing ? <input type="text" value={employee.education} /> : employee.education} />
        <Info label="Trường đào tạo" value={isEditing ? <input type="text" value={employee.school} /> : employee.school} />
        <Info label="Năm tốt nghiệp" value={isEditing ? <input type="number" value={employee.graduationYear} /> : employee.graduationYear} />
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

export default EducationInfo;
