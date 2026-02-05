import React from "react";
import HeaderTitle from "./HeaderTitle";

const FamilyInfo = ({ employee }) => {
  if (!employee) {
    return <div>Chưa có thông tin gia đình</div>;
  }

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <HeaderTitle title="Thông tin gia đình" />
      <div className="py-10 text-center text-slate-400">
        <span className="material-icons text-5xl mb-2 block">family_restroom</span>
        <p className="italic">{employee.familyInfo || "Chưa có thông tin gia đình"}</p>
      </div>
    </section>
  );
};



export default FamilyInfo;
