import React from "react";

const FamilyInfo = ({ employee }) => {
  if (!employee) {
    return <div>Chưa có thông tin gia đình</div>;
  }

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <Header title="Thông tin gia đình" />
      <div className="py-10 text-center text-slate-400">
        <span className="material-icons text-5xl mb-2 block">family_restroom</span>
        <p className="italic">{employee.familyInfo || "Chưa có thông tin gia đình"}</p>
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

export default FamilyInfo;
