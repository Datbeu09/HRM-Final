// src/components/EmployeesDetail/EducationInfo.jsx
import React from "react";
import Info from "../common/Info"; // sửa path cho đúng
import HeaderTitle from "./HeaderTitle";

const BadgeValue = ({ value, tone = "slate" }) => {
  if (!value) return <span className="text-slate-500">-</span>;

  const tones = {
    slate: "bg-slate-100 text-slate-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${tones[tone] || tones.slate
        }`}
    >
      {value}
    </span>
  );
};

export default function EducationInfo({ employee, qualifications = [] }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <HeaderTitle title="Thông tin học vấn" />

      {/* Trình độ chung */}

      {qualifications.length === 0 ? (
        <p className="text-sm text-slate-500">
          Chưa có dữ liệu trường học.
        </p>
      ) : (
        <div className="space-y-6">
          {qualifications.map((q, index) => (
            <div
              key={q.id}
              className="rounded-xl  p-5"
            >
              {/* mỗi bằng cấp là 1 block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Trình độ</p>
                  <BadgeValue value={q.educationLevel} tone="emerald" />
                </div>

                <Info label="Bằng cấp" value={q.degree || "-"} />
                <Info label="Chuyên ngành" value={q.fieldOfStudy || "-"} />



                <Info label="Trường đại học" value={q.institution || "-"} />
                <Info
                  label="Năm tốt nghiệp"
                  value={q.graduationYear || "-"}
                />

                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Ngôn ngữ</p>
                  <BadgeValue
                    value={q.foreignLanguageProficiency}
                    tone="amber"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
